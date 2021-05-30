import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SessionsModule } from "./sessions/sessions.module";
import { SecurityModule } from "./security/security.module";
import { BootstrapModule } from "@ultimate-backend/bootstrap";
import { ConfigModule, ConfigSource } from "@ultimate-backend/config";
import { AccountsModule } from "./accounts/accounts.module";
import { DataStoresModule } from "./data-stores";
import { DataStoreConfigClass } from "./data-stores";
import { PasswordModule } from './password/password.module';
import { OauthModule } from './oauth/oauth.module';
import {BullModule} from "@nestjs/bull";
import {BullConfig} from "./common";
import {GraphQLModule} from "@nestjs/graphql";
import {AppResolver} from "./app.resolver";
import {RedisModule} from "@ultimate-backend/redis";

@Module({
  imports: [
    BootstrapModule.forRoot({
      enableEnv: true,
      filePath: "dist/apps/guardian/assets/bootstrap.yaml",
    }),
    ConfigModule.forRoot({
      global: true,
      load: [
        {
          source: ConfigSource.File,
          filePath: "dist/apps/guardian/assets/config.yaml",
        },
      ],
    }),
    DataStoresModule.forRootAsync({useClass: DataStoreConfigClass}),
    BullModule.forRootAsync({
      useClass: BullConfig,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RedisModule.forRoot({useCluster: false}),
    AccountsModule,
    SessionsModule,
    SecurityModule,
    PasswordModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
