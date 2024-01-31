"use strict";
/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = require("../src/Queue");
class QueueProvider {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: app
        });
    }
    register() {
        this.app.container.singleton('Rlanz/Queue', (container) => {
            const config = container.resolveBinding('Adonis/Core/Config').get('queue');
            const logger = container.resolveBinding('Adonis/Core/Logger');
            const application = container.resolveBinding('Adonis/Core/Application');
            return new Queue_1.BullManager(config, logger, application);
        });
    }
}
exports.default = QueueProvider;
