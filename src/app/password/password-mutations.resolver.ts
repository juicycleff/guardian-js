import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { SessionMutations } from './session.types';
import { SessionResponse } from './queries';
import { CreateSessionRequest, UpdateSessionRequest } from './commands';

@Resolver(() => SessionMutations)
export class SessionMutationsResolver {

  @ResolveField(() => SessionResponse)
  create(@Args('input') input: CreateSessionRequest): SessionResponse {
    return null;
  }

  @ResolveField(() => SessionResponse)
  update(@Args('input') input: UpdateSessionRequest): SessionResponse {
    return null;
  }

  @ResolveField(() => Boolean)
  delete(): boolean {
    return null;
  }

  @ResolveField(() => Boolean)
  refresh(): boolean {
    return null;
  }
}
