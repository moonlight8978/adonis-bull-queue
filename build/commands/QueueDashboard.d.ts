import { BaseCommand } from '@adonisjs/core/build/standalone';
export default class QueueDashboard extends BaseCommand {
    static commandName: string;
    static description: string;
    static settings: {
        loadApp: boolean;
        stayAlive: boolean;
    };
    basePath: string;
    port: number;
    run(): Promise<void>;
    private setupBoard;
}
