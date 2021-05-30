import { ConfigStore } from '@ultimate-backend/config';
import { NextFunction, Response } from 'express';
import { IRequest } from '../gql.context';
import { Identity } from '../identity';

export function identityMiddleware(config: ConfigStore) {
  return (req: IRequest, res: Response, next: NextFunction) => {
    req.identity = new Identity(req, config);
    next();
  };
}
