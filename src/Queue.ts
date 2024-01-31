/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { Queue, Worker } from 'bullmq';
import type { LoggerContract } from '@ioc:Adonis/Core/Logger';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
import type {
  DataForJob,
  DispatchOptions,
  DispatchOverrides,
  JobsList,
  QueueConfig,
  QueueContract,
} from '@ioc:Rlanz/Queue';
import { get, merge } from 'lodash';

export class BullManager implements QueueContract {
  private queues: Map<string, Queue> = new Map();

  constructor(
    private options: QueueConfig,
    private logger: LoggerContract,
    private app: ApplicationContract
  ) {
    this.queues.set(
      'default',
      new Queue('default', {
        // @ts-ignore
        connection: this.options.connection,
        ...this.options.queue,
      })
    );
  }

  public async dispatch<K extends keyof JobsList | string>(
    job: K,
    payload: DataForJob<K>,
    options: DispatchOptions = {}
  ) {
    const disabled = get(options, 'disabled', false);

    if (disabled) {
      this.logger.info(`Job ${job} is disabled`);
      return null;
    }

    const queueName = options.queueName || 'default';

    if (!this.queues.has(queueName)) {
      this.queues.set(
        queueName,
        new Queue(queueName, {
          // @ts-ignore
          connection: this.options.connection,
          ...this.options.queue,
        })
      );
    }

    return await this.queues.get(queueName)!.add(job, payload, {
      ...this.options.jobs,
      ...options,
    });
  }

  public process({ queueName }: { queueName?: string }) {
    this.logger.info(`Queue [${queueName || 'default'}] processing started...`);

    let worker = new Worker(
      queueName || 'default',
      async (job) => {
        let jobHandler;

        try {
          jobHandler = this.app.container.make(job.name, [job]);
        } catch (e) {
          this.logger.error(`Job handler for ${job.name} not found`);
          return;
        }

        this.logger.info(`Job ${job.name} started`);

        await jobHandler.handle(job.data);
        this.logger.info(`Job ${job.name} finished`);
      },
      {
        // @ts-ignore
        connection: this.options.connection,
        ...this.options.worker,
      }
    );

    worker.on('failed', async (job, error) => {
      this.logger.error(error.message, []);

      // If removeOnFail is set to true in the job options, job instance may be undefined.
      // This can occur if worker maxStalledCount has been reached and the removeOnFail is set to true.
      if (job && (job.attemptsMade === job.opts.attempts || job.finishedOn)) {
        // Call the failed method of the handler class if there is one
        let jobHandler = this.app.container.make(job.name, [job]);
        if (typeof jobHandler.failed === 'function') await jobHandler.failed();
      }
    });

    return this;
  }

  public async clear<K extends string>(queueName: K) {
    if (!this.queues.has(queueName)) {
      return this.logger.info(`Queue [${queueName}] doesn't exist`);
    }

    const queue = this.queues.get(queueName || 'default');

    await queue!.obliterate().then(() => {
      return this.logger.info(`Queue [${queueName}] cleared`);
    });
  }

  public list() {
    return this.queues;
  }

  public get<K extends string>(queueName: K) {
    if (!this.queues.has(queueName)) {
      this.logger.warn(`Queue [${queueName}] doesn't exist`);
      return null;
    }

    return this.queues.get(queueName)!;
  }

  public async removeRepeatable(queues: string[]) {
    await Promise.all(
      queues.flatMap(async (name) => {
        const queue = this.get(name);

        if (!queue) {
          return;
        }

        return await queue.getRepeatableJobs().then((jobs) =>
          jobs.map((job) => {
            this.logger.info(`Removing repeatable job ${job.key}`);
            return queue.removeRepeatableByKey(job.key);
          })
        );
      })
    );
  }

  public async schedule<T extends keyof JobsList>(
    job: T,
    payload: DataForJob<T>,
    dispatchOptions: DispatchOptions,
    overrides: DispatchOverrides = {}
  ) {
    dispatchOptions = merge(dispatchOptions, get(overrides, 'options', {}));

    if (dispatchOptions.repeat) {
      await this.dispatch(job, payload, {
        ...dispatchOptions,
        repeat: {
          ...dispatchOptions.repeat,
          // To prevent schedule delaying until next execution
          immediately: false,
        },
      });
    } else {
      await this.dispatch(job, payload, dispatchOptions);
    }
  }
}
