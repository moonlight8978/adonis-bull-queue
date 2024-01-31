"use strict";
/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const standalone_1 = require("@adonisjs/core/build/standalone");
class MakeJob extends standalone_1.BaseCommand {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async run() {
        const stub = (0, node_path_1.join)(__dirname, '..', '/templates/make_job.txt');
        const path = this.application.resolveNamespaceDirectory('jobs');
        this.generator
            .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
            .stub(stub)
            .destinationDir(path || 'app/Jobs')
            .useMustache()
            .appRoot(this.application.cliCwd || this.application.appRoot)
            .apply({ name: this.name });
        await this.generator.run();
    }
}
Object.defineProperty(MakeJob, "commandName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'make:job'
});
Object.defineProperty(MakeJob, "description", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Make a new dispatch-able job'
});
Object.defineProperty(MakeJob, "settings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        loadApp: true,
        stayAlive: false,
    }
});
exports.default = MakeJob;
__decorate([
    standalone_1.args.string({ description: 'Name of the job class' })
], MakeJob.prototype, "name", void 0);
