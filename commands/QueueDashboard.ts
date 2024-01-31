import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { QueueConfig } from '@ioc:Rlanz/Queue';

export default class QueueDashboard extends BaseCommand {
  public static commandName = 'queue:dashboard';

  public static description = 'Start job queue dashboard';

  public static settings = {
    loadApp: true,
    stayAlive: true,
  };

  @flags.string({ name: 'root' })
  public basePath: string = '/queue/dashboard';

  @flags.number()
  public port: number = 9999;

  public async run() {
    this.setupBoard();
  }

  private setupBoard() {
    const { queues: queueNames, connection } = this.application.container
      .resolveBinding('Adonis/Core/Config')
      .get('queue') as QueueConfig;

    const queues = queueNames.map(
      (queueName) =>
        new BullMQAdapter(
          new Queue(queueName, {
            connection,
          })
        )
    );

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(this.basePath);

    createBullBoard({
      queues,
      serverAdapter: serverAdapter,
    });

    const app = express();
    app.use(this.basePath, serverAdapter.getRouter());
    const server = app.listen(this.port, () => {
      this.logger.info(`BullBoard server listening on port ${this.port}`);
    });

    this.onExit(() => {
      server.close();
    });
  }
}
