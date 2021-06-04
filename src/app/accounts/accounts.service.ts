import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { FeaturesConfig, FieldsPolicyConfig, Identity } from '../common';
import { AccountModel } from '../data-stores/models';
import { BaseDatastore } from '../data-stores/stores';
import { PasswordService } from '../password/password.service';
import { CreateAccountRequest, UpdateAccountRequest } from './commands';

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

    if (!cmd.email && !cmd.username && !cmd.phoneNumber) {
      throw new BadRequestException(
        'email, phone number or username field must be provided',
      );
    }

    const enableEmail = this.fieldPolicyConfig.email.requireConfirmation && !cmd.email;
    const enablePhoneNumber =
      this.fieldPolicyConfig.phoneNumber.requireConfirmation && !cmd.phoneNumber;
    const requiredEmailOrPhoneNumber =
      this.featuresConfig.signup.enableVerification && (enableEmail || enablePhoneNumber);
    if (requiredEmailOrPhoneNumber) {
      throw new BadRequestException('email or phone number field must be provided');
    }

    let phoneNumber;
    if (cmd.phoneNumber) {
      phoneNumber = `${cmd.phoneNumber.prefix}-${cmd.phoneNumber.digit}`;
    }

    this.passwordService.isPasswordValid(cmd.password);
    const hashPassword = await this.passwordService.encryptPassword(cmd.password);
    return this.datastore.account.create({
      ...cmd,
      phoneNumber,
      password: hashPassword,
      metadata: {
        verifiedIdentities: [],
      },
    });
  }

  async findByIdentity(
    value: string,
    type: 'all' | 'email' | 'username' | 'phoneNumber' | 'id',
  ): Promise<AccountModel> {
    switch (type) {
      case 'email':
        return this.datastore.account.findByEmail(value);
      case 'phoneNumber':
        const phoneNumberParts = value.split('-');
        if (phoneNumberParts.length < 2 || phoneNumberParts.length > 2) {
          throw new BadRequestException(
            'please provide a valid phone number eg. +1-0000000000',
          );
        }
        return this.datastore.account.findByPhoneNumber(
          phoneNumberParts[0],
          phoneNumberParts[1],
        );
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

  async update(accountID: string, cmd: UpdateAccountRequest): Promise<AccountModel> {
    const account = await this.datastore.account.findById(accountID);
    const payload: Partial<AccountModel> = {};

    if (cmd.phoneNumber) {
      if (!this.fieldPolicyConfig.phoneNumber.mutable) {
        throw new BadRequestException('you can"t change your phone number');
      }
      payload.phoneNumber = `${cmd.phoneNumber.prefix}-${cmd.phoneNumber.digit}`;
      payload.metadata.verifiedIdentities = account.metadata.verifiedIdentities.filter(
        (id) => payload.phoneNumber !== id,
      );
    }

    if (cmd.email) {
      if (!this.fieldPolicyConfig.email.mutable) {
        throw new BadRequestException('you can"t change your email');
      }
      payload.email = cmd.email;
      payload.metadata.verifiedIdentities = account.metadata.verifiedIdentities.filter(
        (id) => payload.email !== id,
      );
    }

    if (cmd.username) {
      if (!this.fieldPolicyConfig.email.mutable) {
        throw new BadRequestException('you can"t change your username');
      }
      payload.username = cmd.username;
    }

    return this.datastore.account.update(accountID, payload);
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
