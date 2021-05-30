import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlContext } from '../common';
import { CreateSessionRequest, UpdateSessionRequest } from './commands';
import { SessionResponse } from './queries';
import { SessionMutations, SessionQueries } from './session.types';
import { SessionsService } from './sessions.service';

@Resolver(() => SessionQueries)
export class SessionQueriesResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @ResolveField(() => Boolean)
  passwordlessToken(): boolean {
    return null;
  }
}
