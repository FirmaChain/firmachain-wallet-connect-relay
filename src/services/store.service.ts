import { createClient } from 'redis';

import { logger } from '../utils/logger';

class StoreService {
  constructor(public config: { url: string }, private client = createClient({ url: config.url })) {
    this.initialize();
  }

  public async setMessage(key: string, message: string, expireSecond?: number): Promise<void> {
    await this.client.set(key, message);

    if (expireSecond) {
      await this.client.expire(key, expireSecond);
    }
  }

  public async getMessage(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async removeMessage(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async hget(key: string, field: string): Promise<any> {
    return await this.client.hGet(key, field);
  }

  public async hgetAll(key: string): Promise<any> {
    return await this.client.hGetAll(key);
  }

  public async keys(keys: string): Promise<string[]> {
    return await this.client.keys(keys);
  }

  private initialize(): void {
    this.client.on('error', (e) => {
      logger.error(e);
    });
    this.client.connect();
    this.client.on('ready', () => {
      logger.info(`Redis Connected ${this.config.url}`);
    });
  }
}

export default StoreService;
