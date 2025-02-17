/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { QueueConfig } from '@ioc:Rlanz/Queue';

export default class QueueListener extends BaseCommand {
  public static commandName = 'queue:listen';
  public static description = 'Listen to one or multiple queues';

  @flags.array({ alias: 'q', description: 'The queue(s) to listen on' })
  public queue: string[] = [];

  public static settings = {
    loadApp: true,
    stayAlive: true,
  };

  public async run() {
    const Queue = this.application.container.resolveBinding('Rlanz/Queue');
    const Config = this.application.container.resolveBinding('Adonis/Core/Config');
    const queueConfig = Config.get('queue') as QueueConfig;
    const Router = this.application.container.use('Adonis/Core/Route');
    Router.commit();

    const queues = this.queue.length ? this.queue : queueConfig.queues;

    await Promise.all(
      queues.map((queue) =>
        Queue.process({
          queueName: queue,
        })
      )
    );
  }
}
