/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
/// <reference path="../adonis-typings/index.d.ts" />
/// <reference types="@adonisjs/application/build/adonis-typings" />
/// <reference types="@adonisjs/application/build/adonis-typings/application" />
/// <reference types="@adonisjs/drive/build/adonis-typings/container" />
/// <reference types="@adonisjs/http-server/build/adonis-typings/container" />
/// <reference types="@adonisjs/core/build/adonis-typings/container" />
/// <reference types="@adonisjs/events/build/adonis-typings/container" />
/// <reference types="@adonisjs/hash/build/adonis-typings/container" />
/// <reference types="@adonisjs/encryption/build/adonis-typings/container" />
/// <reference types="@adonisjs/validator/build/adonis-typings/container" />
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
export default class QueueProvider {
    protected app: ApplicationContract;
    constructor(app: ApplicationContract);
    register(): void;
}
