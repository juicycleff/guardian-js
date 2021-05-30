import { NestFactory } from '@nestjs/core';
import { ConfigStore } from '@ultimate-backend/config';
import { UBServiceFactory } from '@ultimate-backend/core';
import { AppModule } from './app/app.module';
import { identityMiddleware } from './app/common/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigStore>(ConfigStore);
  app.use(identityMiddleware(config));

  await UBServiceFactory.create(app)
    .withSwagger()
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
    .withPrefix('api/v1')
    .start();
}

(async () => await bootstrap())();
