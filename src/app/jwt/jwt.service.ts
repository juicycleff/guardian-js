import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { v4 } from 'uuid';
import { FilesConfig, SecurityConfig } from '../common';
import { PrivateClaim, PublicClaim } from './jwt.types';

@Injectable()
export class JwtService {
  @ConfigValue('security', {})
  securityConfig: SecurityConfig;

  @ConfigValue('files', {})
  filesConfig: FilesConfig;

  private createClaim(cmd: PublicClaim | PrivateClaim): string {
    const privateKey = fs.readFileSync(path.resolve(this.filesConfig.securityKey));
    return jwt.sign(
      {
        ...cmd,
        iat: Date.now(),
        jti: v4(),
      },
      privateKey,
      {
        algorithm: 'RS512',
        expiresIn: new Date(this.securityConfig.jwtExpiration).getTime(),
        issuer: this.securityConfig.jwtIssuer,
        audience: 'audience',
      },
    );
  }

  createPublicClaim(cmd: PublicClaim): string {
    return this.createClaim(cmd);
  }

  createPrivateClaim(cmd: PrivateClaim): string {
    return this.createClaim(cmd);
  }

  verifyPublicToken(token: string): PublicClaim {
    const publicKey = fs.readFileSync(path.resolve(this.filesConfig.securityCert));
    return <PublicClaim>jwt.verify(token, publicKey, {
      algorithms: ['RS512'],
      issuer: this.securityConfig.jwtIssuer,
      audience: 'audience',
    });
  }

  verifyPrivateToken(token: string): PrivateClaim {
    const publicKey = fs.readFileSync(
      path.resolve(process.cwd(), this.filesConfig.securityCert),
    );
    return jwt.verify(token, publicKey, {
      algorithms: ['RS512'],
      issuer: this.securityConfig.jwtIssuer,
      audience: 'audience',
    }) as PrivateClaim;
  }
}
