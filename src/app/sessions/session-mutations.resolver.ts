import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlContext } from '../common';
import { CreateSessionRequest, UpdateSessionRequest } from './commands';
import { SessionResponse } from './queries';
import { SessionMutations } from './session.types';
import { SessionsService } from './sessions.service';

@Resolver(() => SessionMutations)
export class SessionMutationsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @ResolveField(() => SessionResponse)
  async create(
    @Args('input') input: CreateSessionRequest,
    @Context() ctx: GqlContext,
  ): Promise<SessionResponse> {
    const ip = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress;
    return await this.sessionsService.create(input, ctx.req.identity, ip);
  }

  @ResolveField(() => SessionResponse)
  update(@Args('input') input: UpdateSessionRequest): SessionResponse {
    return null;
  }

  @ResolveField(() => Boolean)
  delete(@Context() ctx: GqlContext): boolean {
    return this.sessionsService.delete(ctx.req.identity);
  }

  @ResolveField(() => Boolean)
  refresh(): boolean {
    return null;
  }

  @ResolveField(() => SessionResponse)
  passwordlessToken(): SessionResponse {
    return null;
  }
}
