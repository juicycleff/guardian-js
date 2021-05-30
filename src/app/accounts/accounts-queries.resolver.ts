import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { AccountMutations } from './account.types';
import { AccountResponse } from './queries';
import { CreateAccountRequest, UpdateAccountRequest } from './commands';

@Resolver(() => AccountMutations)
export class AccountsMutationResolver {

  @ResolveField(() => AccountResponse)
  create(@Args('input') input: CreateAccountRequest): AccountResponse {
    return null;
  }

  @ResolveField(() => AccountResponse)
  update(@Args('input') input: UpdateAccountRequest): AccountResponse {
    return null;
  }

  @ResolveField(() => Boolean)
  lock(): boolean {
    return null;
  }

  @ResolveField(() => Boolean)
  unlock(): boolean {
    return null;
  }

  @ResolveField(() => Boolean)
  expirePassword(): boolean {
    return null;
  }

  @ResolveField(() => Boolean)
  delete(): boolean {
    return null;
  }
}
