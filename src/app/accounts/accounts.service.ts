import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { FeaturesConfig, FieldsPolicyConfig, Identity } from '../common';
import { AccountModel } from '../data-stores/models';
import { BaseDatastore } from '../data-stores/stores';
import { PasswordService } from '../password/password.service';
import { CreateAccountRequest } from './commands';

@Injectable()
export class AccountsService {
  @ConfigValue('features', {})
  featuresConfig: FeaturesConfig;

  @ConfigValue('fieldsPolicy', {})
  fieldPolicyConfig: FieldsPolicyConfig;

  constructor(
    private readonly datastore: BaseDatastore<any>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(cmd: CreateAccountRequest): Promise<AccountModel> {
    if (!this.featuresConfig.signup.enabled) {
      throw new BadRequestException('signup is not enabled');
    }

    if (!cmd.email && !cmd.username && !cmd.mobile) {
      throw new BadRequestException('email, mobile or username field must be provided');
    }

    const enableEmail = (this.fieldPolicyConfig.email.requireConfirmation && !cmd.email);
    const enableMobile = (this.fieldPolicyConfig.mobile.requireConfirmation && !cmd.mobile);
    const requiredEmailOrMobile =
      this.featuresConfig.signup.enableVerification && (enableEmail || enableMobile);
    if (requiredEmailOrMobile) {
      throw new BadRequestException('email or mobile field must be provided');
    }

    let mobile;
    if (cmd.mobile) {
      mobile = `${cmd.mobile.prefix}-${cmd.mobile.digit}`;
    }

    this.passwordService.isPasswordValid(cmd.password);
    const hashPassword = await this.passwordService.encryptPassword(cmd.password);
    return this.datastore.account.create({
      ...cmd,
      mobile,
      password: hashPassword,
      metadata: {
        verifiedIdentities: [],
      },
    });
  }

  async findByIdentity(
    value: string,
    type: 'all' | 'email' | 'username' | 'mobile' | 'id',
  ): Promise<AccountModel> {
    switch (type) {
      case 'email':
        return this.datastore.account.findByEmail(value);
      case 'mobile':
        const mobileParts = value.split('-');
        if (mobileParts.length < 2 || mobileParts.length > 2) {
          throw new BadRequestException(
            'please provide a valid mobile number eg. +1-0000000000',
          );
        }
        return this.datastore.account.findByMobile(mobileParts[0], mobileParts[1]);
      case 'username':
        return this.datastore.account.findByUsername(value);
      case 'id':
        return this.datastore.account.findById(value);
      case 'all':
        return this.datastore.account.findByIdentity(value);
      default:
        return this.datastore.account.findByIdentity(value);
    }
  }

  async isAvailable(value: string): Promise<boolean> {
    try {
      return !!(await this.findByIdentity(value, 'all'));
    } catch (e) {
      return false;
    }
  }

  async passwordExpire(accountID: string): Promise<boolean> {
    return this.datastore.account.requireNewPassword(accountID);
  }

  async lock(accountID: string): Promise<boolean> {
    return this.datastore.account.lock(accountID);
  }

  async unlock(accountID: string): Promise<boolean> {
    return this.datastore.account.unlock(accountID);
  }

  async delete(identity: Identity): Promise<boolean> {
    return !!this.datastore.account.delete(identity.accountID);
  }
}
