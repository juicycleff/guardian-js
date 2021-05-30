import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { defer } from 'rxjs';
import { Database, open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import * as url from 'url';
import { DatastoreConfig, handleRetry } from '../../common';
import { BaseDatastore } from './base.datastore';

@Injectable()
export class SqliteDatastoreProvider
  extends BaseDatastore<Database>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  logger = new Logger(SqliteDatastoreProvider.name);

  @ConfigValue('datastore', {})
  private config: DatastoreConfig;

  async connect(): Promise<void> {
    if (!this.config) {
      throw new Error('Missing database configuration');
    }

    try {
      return await defer(async () => {
        this.client = await open({
          filename: `/tmp/${this.config.databaseName}.db`,
          driver: sqlite3.cached.Database,
        });
        this.logger.log('sqlite client connected successfully');
      })
        .pipe(
          handleRetry(
            this.config.retryAttempts,
            this.config.retryDelays,
            SqliteDatastoreProvider.name,
          ),
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async close(): Promise<void> {
    return await this.client.close();
  }

  async onApplicationBootstrap() {
    console.log(url.parse(this.config.databaseUrl));
    await this.connect();
  }

  async onApplicationShutdown() {
    try {
      await this.close();
    } catch (e) {
      //
    }
  }
}
