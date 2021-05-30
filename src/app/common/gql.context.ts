import { Request as ExpressRequest } from 'express';
import { Identity } from './identity';
// import { Context } from 'apollo-server-core/src/types';

export interface IRequest extends ExpressRequest {
  identity: Identity;
}

export interface GqlContext {
  connection?: any;
  req?: Partial<IRequest>;
}
