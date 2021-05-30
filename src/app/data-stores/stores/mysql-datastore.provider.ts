import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { createPool } from 'mysql2';
import { Pool } from 'mysql2/promise';
import { defer } from 'rxjs';
import { DatastoreConfig, handleRetry } from '../../common';
import { BaseDatastore } from './base.datastore';

@Injectable()
export class MysqlDatastoreProvider
  extends BaseDatastore<Pool>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private logger = new Logger(MysqlDatastoreProvider.name);

  @ConfigValue('datastore', {})
  private config: DatastoreConfig;

  async connect(): Promise<void> {
    if (!this.config) {
      throw new Error('Missing database configuration');
    }

    try {
      return await defer(async () => {
        this.client = createPool({
          uri: this.config.databaseUrl,
        }).promise();
        this.logger.log('mysql client connected successfully');
      })
        .pipe(
          handleRetry(
            this.config.retryAttempts,
            this.config.retryDelays,
            MysqlDatastoreProvider.name,
          ),
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async close(): Promise<void> {
    return await this.client.end();
  }

  async onApplicationBootstrap() {
    await this.connect();
  }

  async onApplicationShutdown() {
    await this.close();
  }
}
