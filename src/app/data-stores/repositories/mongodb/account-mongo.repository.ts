import { ConflictException, NotFoundException } from '@nestjs/common';
import { defaultsDeep } from 'lodash';
import { Collection, Db, FindOneAndUpdateOption, MongoError, ObjectId } from 'mongodb';
import { FeaturesConfig } from '../../../common';
import { AccountModel } from '../../models';
import { DatabaseTables } from '../../stores/store.helpers';
import { AccountRepositoryContract } from '../account-repository.contract';

export class AccountMongoRepository implements AccountRepositoryContract {
  private collection: Collection;

  constructor(private readonly db: Db, private readonly featuresConfig: FeaturesConfig) {
    this.collection = db.collection(DatabaseTables.accounts.name);
  }

  async findByUsername(username: string): Promise<AccountModel> {
    const rsp = await this.collection.findOne<AccountModel>({
      username: username,
      deletedAt: null,
    });
    if (!rsp) {
      throw new NotFoundException('account not found by username');
    }

    return new AccountModel(rsp);
  }

  async findByEmail(email: string): Promise<AccountModel> {
    const rsp = await this.collection.findOne<AccountModel>({
      username: email,
      deletedAt: null,
    });
    if (!rsp) {
      throw new NotFoundException('account not found by email');
    }

    return new AccountModel(rsp);
  }

  async findById(id: string): Promise<AccountModel> {
    const rsp = await this.collection.findOne<AccountModel>({
      _id: ObjectId(id),
      deletedAt: null,
    });
    if (!rsp) {
      throw new NotFoundException('account not found by ID');
    }

    return new AccountModel(rsp);
  }

  async findByIdentity(id: string): Promise<AccountModel> {
    const rsp = await this.collection.findOne<AccountModel>({
      $or: [
        {
          username: id,
        },
        {
          email: id,
        },
        {
          phoneNumber: id,
        },
      ],
      deletedAt: null,
    });
    if (!rsp) {
      throw new NotFoundException('account not found by identity');
    }

    return new AccountModel(rsp);
  }

  async findByPhoneNumber(digit: string, prefix: string): Promise<AccountModel> {
    const rsp = await this.collection.findOne<AccountModel>({
      username: `${prefix}-${digit}`,
      deletedAt: null,
    });
    if (!rsp) {
      throw new NotFoundException('account not found by phone number');
    }

    return new AccountModel(rsp);
  }

  async create(cmd: Partial<AccountModel>): Promise<AccountModel> {
    try {
      const now = Date.now();
      const updateObj = {
        locked: false,
        requireNewPassword: false,
        passwordChangedAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        enable2fa: false,
        lastLoginAt: null,
        currentLoginAt: null,
        loginCountAt: 0,
        currentLoginIP: null,
        lastLoginIP: null,
        failedAttempts: 0,
        ...cmd,
      } as AccountModel;
      const resp = await this.collection.insertOne<AccountModel>(
        defaultsDeep({}, updateObj, cmd),
      );
      return await this.findById(resp.insertedId);
    } catch (e) {
      if (e instanceof MongoError) {
        if (e.code === 11000) {
          throw new ConflictException('Account is not available');
        }
      }

      throw e;
    }
  }

  async requireNewPassword(id: string): Promise<boolean> {
    const now = Date.now();
    const resp = await this.collection.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          requireNewPassword: true,
          updatedAt: now,
        },
      },
    );
    return !!resp;
  }

  async setLastLogin(id: string, ip?: string): Promise<boolean> {
    const account = await this.findById(id);
    const resp = await this.update(id, {
      lastLoginAt: new Date(),
      currentLoginAt: new Date(),
      loginCountAt: (account.loginCountAt || 0) + 1,
      currentLoginIP: ip,
      lastLoginIP: account.currentLoginIP,
      failedAttempts: 0,
    });
    return !!resp;
  }

  async update(id: string, cmd: Partial<AccountModel>): Promise<AccountModel> {
    return await this.collection.findOneAndUpdate(
      {
        _id: ObjectId(id),
        deletedAt: null,
      },
      {
        $set: {
          ...cmd,
          updatedAt: Date.now(),
        },
      },
      {
        returnDocument: 'after',
      } as FindOneAndUpdateOption,
    );
  }

  async unlock(id: string): Promise<boolean> {
    const resp = await this.update(id, {
      locked: false,
    });
    return !!resp;
  }

  async lock(id: string): Promise<boolean> {
    const resp = await this.update(id, {
      locked: true,
      lockedAt: new Date(),
    });
    return !!resp;
  }

  async setPassword(id: string, password: string): Promise<boolean> {
    const resp = await this.update(id, {
      password,
      requireNewPassword: false,
      passwordChangedAt: new Date(),
      resetPasswordCreatedAt: null,
      resetPasswordToken: null,
    });
    return !!resp;
  }

  async delete(id: string): Promise<AccountModel> {
    const account = await this.findById(id);

    if (this.featuresConfig.enableSoftDelete) {
      return (await this.update(id, {
        deletedAt: new Date(),
      })) as AccountModel;
    } else {
      await this.collection.deleteOne({
        _id: ObjectId(id),
      });
    }

    return account;
  }
}
