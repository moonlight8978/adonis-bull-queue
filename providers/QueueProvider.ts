/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { QueueConfig } from '@ioc:Rlanz/Queue';
import { BullManager } from '../src/Queue';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class QueueProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Rlanz/Queue', (container) => {
      const config = container.resolveBinding('Adonis/Core/Config').get('queue') as QueueConfig;
      const logger = container.resolveBinding('Adonis/Core/Logger');
      const application = container.resolveBinding('Adonis/Core/Application');

      return new BullManager(config, logger, application);
    });
  }
}
