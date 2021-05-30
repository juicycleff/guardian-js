import { UnauthorizedException } from '@nestjs/common';
import { ConfigStore } from '@ultimate-backend/config';
import { Request as ExpressRequest } from 'express';
import { Session } from 'express-session';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { PrivateClaim, PublicClaim } from '../jwt/jwt.types';
import { FilesConfig, SecurityConfig } from './guardian.config';

export class Identity {
  constructor(private req: ExpressRequest, private readonly config: ConfigStore) {}

  get accountID(): string {
    const claim = this.getClaim();
    return claim.sub;
  }

  get account(): PrivateClaim | PublicClaim {
    return this.getClaim();
  }

  get isService(): boolean {
    const claim = this.getClaim();
    return claim instanceof PrivateClaim ? claim.is_service : false;
  }

  forget(): Session {
    return this.req.session.destroy((err) => {
      // cannot access session here
    });
  }

  remember(token: string): void {
    const security: SecurityConfig = this.config.get('security');
    this.req.session[security.sessionName] = token;
  }

  private getClaim(): PublicClaim | PrivateClaim {
    const security: any = this.config.get('security', {});
    const token = this.req.session[security.sessionName];
    if (!token) throw new UnauthorizedException();
    return this.verifyClaimToken(token);
  }

  private verifyClaimToken(token: string): PrivateClaim | PublicClaim {
    const securityConfig: SecurityConfig = this.config.get('security');
    const filesConfig: FilesConfig = this.config.get('files');
    const publicKey = fs.readFileSync(path.resolve(filesConfig.securityCert));
    return jwt.verify(token, publicKey, {
      algorithms: ['RS512'],
      issuer: securityConfig.jwtIssuer,
      audience: 'audience',
    }) as any;
  }
}
