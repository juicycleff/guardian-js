import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { BootstrapModule } from '@ultimate-backend/bootstrap';
import { ConfigModule, ConfigSource } from '@ultimate-backend/config';
import { RedisModule } from '@ultimate-backend/redis';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as path from 'path';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthGuard, BullConfig } from './common';
import { DataStoreConfigClass, DataStoresModule } from './data-stores';
import { JwtModule } from './jwt/jwt.module';
import { OauthModule } from './oauth/oauth.module';
import { PasswordModule } from './password/password.module';
import { SecurityModule } from './security/security.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    PrometheusModule.register({
      path: 'mymetrics',
      defaultMetrics: {
        enabled: false,
      },
    }),
    BootstrapModule.forRoot({
      enableEnv: true,
      filePath: path.resolve(__dirname, '../assets/bootstrap.yaml'),
    }),
    ConfigModule.forRoot({
      global: true,
      load: [
        {
          source: ConfigSource.File,
          filePath: path.resolve(__dirname, '../assets/config.yaml'),
        },
      ],
    }),
    DataStoresModule.forRootAsync({ useClass: DataStoreConfigClass }),
    BullModule.forRootAsync({
      useClass: BullConfig,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      tracing: true,
      context: ({ req, res, payload, connection }) => ({ req, res, payload, connection }),
      playground: {
        workspaceName: 'Guardian JS',
        settings: {
          'request.credentials': 'same-origin',
        },
      },
    }),
    RedisModule.forRoot({ useCluster: false }),
    ThrottlerModule.forRoot({
      ttl: 60000,
      limit: 3,
    }),
    AccountsModule,
    SessionsModule,
    SecurityModule,
    PasswordModule,
    OauthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
