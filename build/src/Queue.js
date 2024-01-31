"use strict";
/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullManager = void 0;
const bullmq_1 = require("bullmq");
const lodash_1 = require("lodash");
class BullManager {
    constructor(options, logger, app) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: logger
        });
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: app
        });
        Object.defineProperty(this, "queues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.queues.set('default', new bullmq_1.Queue('default', {
            // @ts-ignore
            connection: this.options.connection,
            ...this.options.queue,
        }));
    }
    async dispatch(job, payload, options = {}) {
        const disabled = (0, lodash_1.get)(options, 'disabled', false);
        if (disabled) {
            this.logger.info(`Job ${job} is disabled`);
            return null;
        }
        const queueName = options.queueName || 'default';
        if (!this.queues.has(queueName)) {
            this.queues.set(queueName, new bullmq_1.Queue(queueName, {
                // @ts-ignore
                connection: this.options.connection,
                ...this.options.queue,
            }));
        }
        return await this.queues.get(queueName).add(job, payload, {
            ...this.options.jobs,
            ...options,
        });
    }
    process({ queueName }) {
        this.logger.info(`Queue [${queueName || 'default'}] processing started...`);
        let worker = new bullmq_1.Worker(queueName || 'default', async (job) => {
            let jobHandler;
            try {
                jobHandler = this.app.container.make(job.name, [job]);
            }
            catch (e) {
                this.logger.error(`Job handler for ${job.name} not found`);
                return;
            }
            this.logger.info(`Job ${job.name} started`);
            await jobHandler.handle(job.data);
            this.logger.info(`Job ${job.name} finished`);
        }, {
            // @ts-ignore
            connection: this.options.connection,
            ...this.options.worker,
        });
        worker.on('failed', async (job, error) => {
            this.logger.error(error.message, []);
            // If removeOnFail is set to true in the job options, job instance may be undefined.
            // This can occur if worker maxStalledCount has been reached and the removeOnFail is set to true.
            if (job && (job.attemptsMade === job.opts.attempts || job.finishedOn)) {
                // Call the failed method of the handler class if there is one
                let jobHandler = this.app.container.make(job.name, [job]);
                if (typeof jobHandler.failed === 'function')
                    await jobHandler.failed();
            }
        });
        return this;
    }
    async clear(queueName) {
        if (!this.queues.has(queueName)) {
            return this.logger.info(`Queue [${queueName}] doesn't exist`);
        }
        const queue = this.queues.get(queueName || 'default');
        await queue.obliterate().then(() => {
            return this.logger.info(`Queue [${queueName}] cleared`);
        });
    }
    list() {
        return this.queues;
    }
    get(queueName) {
        if (!this.queues.has(queueName)) {
            this.logger.warn(`Queue [${queueName}] doesn't exist`);
            return null;
        }
        return this.queues.get(queueName);
    }
    async removeRepeatable(queues) {
        await Promise.all(queues.flatMap(async (name) => {
            const queue = this.get(name);
            if (!queue) {
                return;
            }
            return await queue.getRepeatableJobs().then((jobs) => jobs.map((job) => {
                this.logger.info(`Removing repeatable job ${job.key}`);
                return queue.removeRepeatableByKey(job.key);
            }));
        }));
    }
    async schedule(job, payload, dispatchOptions, overrides = {}) {
        dispatchOptions = (0, lodash_1.merge)(dispatchOptions, (0, lodash_1.get)(overrides, 'options', {}));
        if (dispatchOptions.repeat) {
            await this.dispatch(job, payload, {
                ...dispatchOptions,
                repeat: {
                    ...dispatchOptions.repeat,
                    // To prevent schedule delaying until next execution
                    immediately: false,
                },
            });
        }
        else {
            await this.dispatch(job, payload, dispatchOptions);
        }
    }
}
exports.BullManager = BullManager;
