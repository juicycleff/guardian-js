import { NestFactory } from '@nestjs/core';
import { ConfigStore } from '@ultimate-backend/config';
import { UBServiceFactory } from '@ultimate-backend/core';
import { RedisClient } from '@ultimate-backend/redis';
import { AppModule } from './app/app.module';
import { identityMiddleware } from './app/common/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigStore>(ConfigStore);
  const redisClient = app.get<RedisClient>(RedisClient);
  app.use(identityMiddleware(config, redisClient));

  await UBServiceFactory.create(app)
    .withSwagger()
    .withPrefix('api/v1')
    .withGrpc()
    .withValidation({
      skipMissingProperties: false,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      enableDebugMessages: true,
    })
    .withSession(true)
    // .withCookie()
    .withPoweredBy()
    .start();
}

(async () => await bootstrap())();
