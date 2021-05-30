import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isPlainObject } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { SecureHandlerOptions, SECURE_KEY } from '../decorators';
import { GqlContext, IRequest } from '../gql.context';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const secureOptions = this.reflector.get<SecureHandlerOptions>(
      SECURE_KEY,
      context.getHandler(),
    );
    if (!secureOptions) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    if (isPlainObject(ctx)) {
      return AuthGuard.verifyCurrentSession(ctx.req as any, secureOptions);
    }

    const request = context.switchToHttp().getRequest();
    return AuthGuard.verifyCurrentSession(request, secureOptions);
  }

  private static verifyCurrentSession(
    req: IRequest,
    opts: SecureHandlerOptions,
  ): boolean {
    const identity = req.identity;

    if (!identity) return false;
    if (!identity.accountID) return false;
    if (identity.isService && opts.claim === 'account') return false;
    if (!identity.isService && opts.claim === 'service') return false;

    console.log('isService => ', identity.isService);
    console.log('claim => ', opts.claim);

    return true;
  }
}
