/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

declare module '@ioc:Rlanz/Queue' {
  import type {
    ConnectionOptions,
    WorkerOptions,
    QueueOptions,
    JobsOptions,
    Job,
    Queue as BullQueue,
  } from 'bullmq';

  export type DataForJob<K extends string> = K extends keyof JobsList
    ? JobsList[K]
    : Record<string, unknown>;

  export type DispatchOptions = JobsOptions & {
    queueName?: 'default' | string;
  };

  export type DispatchOverrides = Partial<{
    options: Partial<DispatchOptions>;
    disabled: boolean;
    payload: any;
  }>;

  export type QueueConfig = {
    connection: ConnectionOptions;
    queue: QueueOptions;
    worker: WorkerOptions;
    jobs: JobsOptions;
    queues: string[];
  };

  export interface QueueContract {
    dispatch<K extends keyof JobsList>(
      job: K,
      payload: DataForJob<K>,
      options?: DispatchOptions
    ): Promise<Job | null>;

    dispatch<K extends string>(
      job: K,
      payload: DataForJob<K>,
      options?: DispatchOptions
    ): Promise<Job | null>;

    process(queue: { queueName?: string }): this;

    clear<K extends string>(queue: K): Promise<void>;

    list(): Map<string, BullQueue>;

    get<K extends string>(queue: K): BullQueue | null;

    removeRepeatable(queues: string[]): Promise<void>;

    schedule<T extends keyof JobsList>(
      job: T,
      payload: DataForJob<T>,
      dispatchOptions: DispatchOptions,
      overrides?: DispatchOverrides
    ): Promise<void>;
  }

  export interface JobHandlerContract<TPayload = any> {
    handle(payload: TPayload): Promise<void>;
    failed(): Promise<void>;
  }

  /**
   * An interface to define typed queues/jobs
   */
  export interface JobsList {}

  const Queue: QueueContract;

  export default Queue;

  export { Job };
}

declare module '@ioc:Adonis/Core/Application' {
  import { QueueContract } from '@ioc:Rlanz/Queue';

  interface Bindings {
    'Rlanz/Queue': QueueContract;
  }

  interface ContainerBindings extends Bindings {}
}
