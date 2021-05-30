import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { PasswordModule } from '../password/password.module';
import { SessionMutationsResolver } from './session-mutations.resolver';
import { SessionsController } from './sessions.controller';
import { SessionsResolver } from './sessions.resolver';
import { SessionsService } from './sessions.service';
import { SessionQueriesResolver } from './session-queries.resolver';

@Module({
  imports: [PasswordModule, JwtModule],
  controllers: [SessionsController],
  providers: [SessionsResolver, SessionsService, SessionMutationsResolver, SessionQueriesResolver],
})
export class SessionsModule {}
