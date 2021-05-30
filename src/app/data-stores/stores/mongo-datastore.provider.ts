import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { MongoClient } from 'mongodb';
import { defer } from 'rxjs';
import { DatastoreConfig, FeaturesConfig, handleRetry, HealthStatus } from '../../common';
import { AccountMongoRepository } from '../repositories';
import { OtpMongoRepository } from '../repositories/mongodb/otp-mongo.repository';
import { BaseDatastore } from './base.datastore';
import { DatabaseInnerTableOptions, DatabaseTables } from './store.helpers';

@Injectable()
export class MongoDatastoreProvider
  extends BaseDatastore<MongoClient>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private logger = new Logger(MongoDatastoreProvider.name);

  @ConfigValue('datastore', {})
  private config: DatastoreConfig;

  @ConfigValue('features', {})
  private featuresConfig: FeaturesConfig;

  // private methods
  private async createDatabase() {
    await this.migrateDatabase();
  }

  private async migrateDatabase() {
    const db = this.client.db(this.config.databaseName);

    // check if the length of our collections matches the length in our tables
    if (
      (await db.listCollections().toArray()).length >= Object.keys(DatabaseTables).length
    ) {
      return;
    }

    const promises = [];
    for (const key in DatabaseTables) {
      const table = DatabaseTables[key];
      promises.push(db.createCollection(table.name));
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  private async indexCollection(opts: DatabaseInnerTableOptions): Promise<void> {
    const db = this.client.db(this.config.databaseName);
    const col = db.collection(opts.name);

    if (!opts.indexes) {
      return;
    }

    if (Object.keys(opts.indexes).length <= 0) {
      return;
    }

    const promises = [];
    for (const field in opts.indexes) {
      const idx = opts.indexes[field];
      promises.push(
        col.createIndex(field, {
          ...idx,
        }),
      );
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  private async indexDatabases(): Promise<void> {
    const promises = [];
    for (const key in DatabaseTables) {
      const table = DatabaseTables[key];
      promises.push(this.indexCollection(table));
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  private async init(): Promise<void> {
    await this.connect();
    await this.createDatabase();
    await this.indexDatabases();

    const db = this.client.db(this.config.databaseName);

    this.account = new AccountMongoRepository(db, this.featuresConfig);
    this.oneTimeCode = new OtpMongoRepository(db, this.featuresConfig);
  }

  // public methods
  async health(): Promise<HealthStatus> {
    const status = await this.client.isConnected();
    if (status) {
      return 'READY';
    }

    return 'FAILING';
  }

  async connect(): Promise<void> {
    try {
      return await defer(async () => {
        if (!this.config) {
          throw new Error('Missing database configuration');
        }

        this.client = new MongoClient(this.config.databaseUrl, {
          useUnifiedTopology: true,
        });

        await this.client.connect();
        await this.client.db('admin').command({ ping: 1 });
        this.logger.log('mongodb client connected successfully');
      })
        .pipe(
          handleRetry(
            this.config?.retryAttempts,
            this.config?.retryDelays,
            MongoDatastoreProvider.name,
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

  // lifecycle methods
  async onApplicationBootstrap(): Promise<void> {
    await this.init();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }
}
