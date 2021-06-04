import { ConfigStore } from '@ultimate-backend/config';
import { RedisClient } from '@ultimate-backend/redis';
import { NextFunction, Response } from 'express';
import { IRequest } from '../gql.context';
import { Identity } from '../identity';

export function identityMiddleware(config: ConfigStore, redis: RedisClient) {
  return (req: IRequest, res: Response, next: NextFunction) => {
    req.identity = new Identity(req, config, redis);
    next();
  };
}
