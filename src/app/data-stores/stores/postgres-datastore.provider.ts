import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { Pool } from 'pg';
import * as pgtools from 'pgtools';
import { defer } from 'rxjs';
import * as url from 'url';
import { promisify } from 'util';
import { DatastoreConfig, handleRetry } from '../../common';
import { BaseDatastore } from './base.datastore';

const createdbAsync: any = promisify(pgtools.createdb);

@Injectable()
export class PostgresDatastoreProvider
  extends BaseDatastore<Pool>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  logger = new Logger(PostgresDatastoreProvider.name);

  @ConfigValue('datastore', {})
  private config: DatastoreConfig;

  private async init() {
    await this.connect();
  }

  private async createDatabase() {
    try {
      const dbUrl = url.parse(this.config.databaseUrl);
      const config = {
        user: dbUrl.auth,
        password: dbUrl.hash,
        port: dbUrl.port,
        host: dbUrl.hostname,
      };

      await createdbAsync(config, this.config.databaseName, () => {
        // leave empty
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async connect(): Promise<void> {
    if (!this.config) {
      throw new Error('Missing database configuration');
    }

    try {
      return await defer(async () => {
        this.client = new Pool({
          connectionString: this.config.databaseUrl,
        });
        await this.client.connect();
        this.logger.log('postgres client connected successfully');
      })
        .pipe(
          handleRetry(
            this.config.retryAttempts,
            this.config.retryDelays,
            PostgresDatastoreProvider.name,
          ),
        )
        .toPromise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      return await this.client.end();
    }
  }

  async onApplicationBootstrap() {
    await this.init();
  }

  async onApplicationShutdown() {
    await this.close();
  }
}
