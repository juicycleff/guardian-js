import { SerializeOptions } from '@nestjs/common';
import { classToPlain, deserialize, serialize } from 'class-transformer';
import { AccountResponse } from '../../accounts/queries';
import { BaseModel } from './base.model';

@SerializeOptions({
  enableImplicitConversion: true,
})
export class AccountMetadataModel {
  verifiedIdentities?: string[];
}

@SerializeOptions({
  enableImplicitConversion: true,
})
export class AccountModel extends BaseModel {
  username?: string;

  email?: string;

  mobile?: string;

  password: string;

  lastLoginAt?: Date;

  currentLoginAt?: Date;

  confirmedAt?: Date;

  lockedAt?: Date;

  // confirmationSentAt?: Date;

  passwordChangedAt?: Date;

  // rememberCreatedAt?: Date;

  resetPasswordCreatedAt?: Date;

  loginCountAt?: number;

  failedAttempts?: number;

  resetPasswordToken?: string;

  // confirmationToken?: string;

  // unlockToken?: string;

  lastLoginIP?: string;

  currentLoginIP?: string;

  locked: boolean;

  requireNewPassword: boolean;

  metadata: AccountMetadataModel;

  constructor(props: Partial<AccountModel & { _id?: string }>) {
    super();
    Object.assign(this, { ...props, id: props._id ?? props.id });
  }

  toObject(): Record<string, any> {
    return classToPlain(this);
  }

  fromObject(props: Record<string, any>) {
    Object.assign(this, props);
  }

  serialize(): string {
    return serialize(this);
  }

  deserialize(props: string) {
    Object.assign(this, deserialize(AccountModel, props));
  }

  toResponse(): AccountResponse {
    return {
      id: this.id,
      email: this.email,
      mobile: this.mobile,
      username: this.username,
    };
  }
}
