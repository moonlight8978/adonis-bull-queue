"use strict";
/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
function getStub(...relativePaths) {
    return (0, node_path_1.join)(__dirname, 'templates', ...relativePaths);
}
async function instructions(projectRoot, app, sink) {
    // Setup config
    const configPath = app.configPath('queue.ts');
    new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt')).commit();
    const configDir = app.directoriesMap.get('config') || 'config';
    sink.logger.action('create').succeeded(`${configDir}/queue.ts`);
    // Setup environment
    const env = new sink.files.EnvFile(projectRoot);
    env.set('QUEUE_REDIS_HOST', 'localhost');
    env.set('QUEUE_REDIS_PORT', '6379');
    env.set('QUEUE_REDIS_PASSWORD', '');
    env.commit();
    sink.logger.action('update').succeeded('.env,.env.example');
}
exports.default = instructions;
