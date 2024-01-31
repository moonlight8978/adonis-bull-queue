/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
/// <reference path="../adonis-typings/index.d.ts" />
/// <reference types="@adonisjs/logger/build/adonis-typings/logger" />
/// <reference types="@adonisjs/application/build/adonis-typings" />
/// <reference types="@adonisjs/application/build/adonis-typings/application" />
/// <reference types="@adonisjs/drive/build/adonis-typings/container" />
/// <reference types="@adonisjs/http-server/build/adonis-typings/container" />
/// <reference types="@adonisjs/core/build/adonis-typings/container" />
/// <reference types="@adonisjs/events/build/adonis-typings/container" />
/// <reference types="@adonisjs/hash/build/adonis-typings/container" />
/// <reference types="@adonisjs/encryption/build/adonis-typings/container" />
/// <reference types="@adonisjs/validator/build/adonis-typings/container" />
import { Queue } from 'bullmq';
import type { LoggerContract } from '@ioc:Adonis/Core/Logger';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
import type { DataForJob, DispatchOptions, DispatchOverrides, JobsList, QueueConfig, QueueContract } from '@ioc:Rlanz/Queue';
export declare class BullManager implements QueueContract {
    private options;
    private logger;
    private app;
    private queues;
    constructor(options: QueueConfig, logger: LoggerContract, app: ApplicationContract);
    dispatch<K extends keyof JobsList | string>(job: K, payload: DataForJob<K>, options?: DispatchOptions): Promise<import("bullmq").Job<any, any, string> | null>;
    process({ queueName }: {
        queueName?: string;
    }): this;
    clear<K extends string>(queueName: K): Promise<void>;
    list(): Map<string, Queue<any, any, string>>;
    get<K extends string>(queueName: K): Queue<any, any, string> | null;
    removeRepeatable(queues: string[]): Promise<void>;
    schedule<T extends keyof JobsList>(job: T, payload: DataForJob<T>, dispatchOptions: DispatchOptions, overrides?: DispatchOverrides): Promise<void>;
}
