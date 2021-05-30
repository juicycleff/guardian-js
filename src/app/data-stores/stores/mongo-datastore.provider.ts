import { ConfigValue } from "@ultimate-backend/config";
import { defer } from "rxjs";
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { MongoClient } from "mongodb";

import { BaseDatastore } from "./base.datastore";
import { DatastoreConfig, handleRetry } from "../../common";

@Injectable()
export class MongoDatastoreProvider
  extends BaseDatastore<MongoClient>
  implements OnApplicationBootstrap, OnApplicationShutdown {
  private logger = new Logger(MongoDatastoreProvider.name);

  @ConfigValue("datastore", {})
  private config: DatastoreConfig;

  async connect(): Promise<void> {
    try {
      return await defer(async () => {
        console.log("Datastore", this.config);
        if (!this.config) {
          throw new Error("Missing database configuration");
        }

        this.client = new MongoClient(this.config.dbUrl);

        await this.client.connect();
        await this.client.db("admin").command({ ping: 1 });
        this.logger.log("mongodb client connected successfully");
      })
        .pipe(
          handleRetry(
            this.config?.retryAttempts,
            this.config?.retryDelays,
            MongoDatastoreProvider.name
          )
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
    await this.connect();
  }

  async onApplicationShutdown() {
    await this.close();
  }
}
