import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { BaseDatastore } from "./base.datastore";
import { ConfigValue } from "@ultimate-backend/config";
import { DatastoreConfig, handleRetry } from "../../common";
import { defer } from "rxjs";
import { Pool } from "pg";
import DBMigrate from 'db-migrate';
import pgtools from 'pgtools';
import {promisify} from 'util';
import * as url from "url";

const createdbAsync: any = promisify(pgtools.createdb);

@Injectable()
export class PostgresDatastoreProvider
  extends BaseDatastore<Pool>
  implements OnApplicationBootstrap, OnApplicationShutdown {
  logger = new Logger(PostgresDatastoreProvider.name);

  @ConfigValue("datastore", {})
  private config: DatastoreConfig;

  private async init() {
    // await this.createDatabase();
    await this.connect();
    console.log('dbmigrate')
    const dbmigrate = DBMigrate.getInstance(true);
    console.log(dbmigrate)
  }

  private async createDatabase() {
    try {
      const dbUrl = url.parse(this.config.dbUrl);
      const config = {
        user: dbUrl.auth,
        password: dbUrl.hash,
        port: dbUrl.port,
        host: dbUrl.hostname
      };

      await createdbAsync(config, this.config.dbName, () => {
        // leave empty
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async connect(): Promise<void> {
    if (!this.config) {
      throw new Error("Missing database configuration");
    }

    try {
      return await defer(async () => {
        this.client = new Pool({
          connectionString: this.config.dbUrl,
        });
        await this.client.connect();
        this.logger.log("postgres client connected successfully");
      })
        .pipe(
          handleRetry(
            this.config.retryAttempts,
            this.config.retryDelays,
            PostgresDatastoreProvider.name
          )
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
    await this.init();
  }

  async onApplicationShutdown() {
    await this.close();
  }

}
