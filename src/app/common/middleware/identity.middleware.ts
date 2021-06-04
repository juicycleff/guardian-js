import { ConfigStore } from '@ultimate-backend/config';
import { NextFunction, Response } from 'express';
import { IRequest } from '../gql.context';
import { Identity } from '../identity';
import {RedisClient} from "@ultimate-backend/redis";

export function identityMiddleware(config: ConfigStore, redis: RedisClient) {
  return (req: IRequest, res: Response, next: NextFunction) => {
    req.identity = new Identity(req, config, redis);
    next();
  };
}
