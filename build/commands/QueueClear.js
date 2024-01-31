"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
class QueueListener extends standalone_1.BaseCommand {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    async run() {
        const Queue = this.application.container.resolveBinding('Rlanz/Queue');
        const Config = this.application.container.resolveBinding('Adonis/Core/Config');
        const queueConfig = Config.get('queue');
        const queues = this.queue.length ? this.queue : queueConfig.queues;
        await Promise.all(queues.map(async (queue) => {
            await Queue.clear(queue);
        }));
    }
}
Object.defineProperty(QueueListener, "commandName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'queue:clear'
});
Object.defineProperty(QueueListener, "description", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Clears a queue of Jobs'
});
Object.defineProperty(QueueListener, "settings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        loadApp: true,
        stayAlive: false,
    }
});
exports.default = QueueListener;
__decorate([
    standalone_1.flags.array({ alias: 'q', description: 'The queue(s) to clear' })
], QueueListener.prototype, "queue", void 0);
