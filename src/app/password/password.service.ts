import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import * as argon2 from 'argon2';
import zxcvbn from 'zxcvbn-typescript';
import { FieldsPolicyConfig, SecurityConfig } from '../common';
import { PasswordScoreEnum } from './queries';

@Injectable()
export class PasswordService {
  @ConfigValue('security', {})
  securityConfig: SecurityConfig;

  @ConfigValue('fieldsPolicy', {})
  fieldPolicyConfig: FieldsPolicyConfig;

  async encryptPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, {
      salt: Buffer.from(this.securityConfig.authSalt),
    });

    return hash.toString();
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password, {
      salt: Buffer.from(this.securityConfig.authSalt),
    });
  }

  private getScore(score): PasswordScoreEnum {
    switch (score) {
      case 0:
        return PasswordScoreEnum.TooWeak;
      case 1:
        return PasswordScoreEnum.Weak;
      case 2:
        return PasswordScoreEnum.Medium;
      case 3:
        return PasswordScoreEnum.Strong;
      case 4:
        return PasswordScoreEnum.VeryStrong;
      default:
        throw new BadRequestException('invalid password score');
    }
  }

  scorePassword(password: string): PasswordScoreEnum {
    const passwordScore = zxcvbn(password);
    return this.getScore(passwordScore.score);
  }

  isPasswordValid(password: string): boolean {
    const passwordScore = zxcvbn(password);
    this.validatePassword(password, passwordScore.score);
    return true;
  }

  private validatePassword(password: string, score: number) {
    const pass = this.fieldPolicyConfig.password;
    if (password.length < pass.minimumLength)
      throw new BadRequestException(`Password must be at least ${pass.minimumLength}`);
    if (password.match(/\s+/g))
      throw new BadRequestException(`Password must not contain spaces`);
    if (pass.requireLowercase && !password.match(/[a-z]+/g))
      throw new BadRequestException(`Password must contain lowercase characters`);
    if (pass.requireNumbers && !password.match(/\d+/g))
      throw new BadRequestException(`Password must contain at least 1 digit`);
    if (pass.requireUppercase && !password.match(/[A-Z]+/g))
      throw new BadRequestException(`Password must contain uppercase characters`);
    if (pass.requireSymbols && !password.match(/[A-Z]+/g))
      throw new BadRequestException(`Password must contain uppercase characters`);
    if (pass.requireSymbols && !password.match(/\W|_/g))
      throw new BadRequestException(`Password must contain symbols`);
    if (score < pass.strength)
      throw new BadRequestException(`Password must contain symbols`);
  }
}
