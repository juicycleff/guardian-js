import { Module } from '@nestjs/common';
import { OauthResolver } from './oauth.resolver';
import { OauthController } from './oauth.controller';

@Module({
  providers: [OauthResolver],
  controllers: [OauthController]
})
export class OauthModule {}
