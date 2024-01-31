/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { BaseCommand } from '@adonisjs/core/build/standalone';
export default class MakeJob extends BaseCommand {
    static commandName: string;
    static description: string;
    name: string;
    static settings: {
        loadApp: boolean;
        stayAlive: boolean;
    };
    run(): Promise<void>;
}
