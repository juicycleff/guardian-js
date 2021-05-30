import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../gql.context';
import { Identity } from '../identity';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext): Identity => {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    if (isPlainObject(ctx)) {
      return ctx.req.identity;
    }

    const request = context.switchToHttp().getRequest();
    return request.identity;
  },
);
