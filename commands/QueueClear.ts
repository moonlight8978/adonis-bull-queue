import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { QueueConfig } from '@ioc:Rlanz/Queue';

export default class QueueListener extends BaseCommand {
  public static commandName = 'queue:clear';
  public static description = 'Clears a queue of Jobs';

  @flags.array({ alias: 'q', description: 'The queue(s) to clear' })
  public queue: string[] = [];

  public static settings = {
    loadApp: true,
    stayAlive: false,
  };

  public async run() {
    const Queue = this.application.container.resolveBinding('Rlanz/Queue');
    const Config = this.application.container.resolveBinding('Adonis/Core/Config');
    const queueConfig = Config.get('queue') as QueueConfig;

    const queues = this.queue.length ? this.queue : queueConfig.queues;

    await Promise.all(
      queues.map(async (queue) => {
        await Queue.clear(queue);
      })
    );
  }
}
