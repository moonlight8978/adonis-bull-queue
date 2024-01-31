"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const express_1 = __importDefault(require("express"));
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const bullmq_1 = require("bullmq");
const express_2 = require("@bull-board/express");
class QueueDashboard extends standalone_1.BaseCommand {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "basePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/queue/dashboard'
        });
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 9999
        });
    }
    async run() {
        this.setupBoard();
    }
    setupBoard() {
        const { queues: queueNames, connection } = this.application.container
            .resolveBinding('Adonis/Core/Config')
            .get('queue');
        const queues = queueNames.map((queueName) => new bullMQAdapter_1.BullMQAdapter(new bullmq_1.Queue(queueName, {
            connection,
        })));
        const serverAdapter = new express_2.ExpressAdapter();
        serverAdapter.setBasePath(this.basePath);
        (0, api_1.createBullBoard)({
            queues,
            serverAdapter: serverAdapter,
        });
        const app = (0, express_1.default)();
        app.use(this.basePath, serverAdapter.getRouter());
        const server = app.listen(this.port, () => {
            this.logger.info(`BullBoard server listening on port ${this.port}`);
        });
        this.onExit(() => {
            server.close();
        });
    }
}
Object.defineProperty(QueueDashboard, "commandName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'queue:dashboard'
});
Object.defineProperty(QueueDashboard, "description", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Start job queue dashboard'
});
Object.defineProperty(QueueDashboard, "settings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        loadApp: true,
        stayAlive: true,
    }
});
exports.default = QueueDashboard;
__decorate([
    standalone_1.flags.string({ name: 'root' })
], QueueDashboard.prototype, "basePath", void 0);
__decorate([
    standalone_1.flags.number()
], QueueDashboard.prototype, "port", void 0);
