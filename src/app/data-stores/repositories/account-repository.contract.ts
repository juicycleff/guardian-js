import { AccountModel } from '../models';

export interface AccountRepositoryContract {
  findByUsername(username: string): AccountModel | Promise<AccountModel>;

  findByEmail(email: string): AccountModel | Promise<AccountModel>;

  findById(id: string): AccountModel | Promise<AccountModel>;

  findByIdentity(id: string): AccountModel | Promise<AccountModel>;

  findByMobile(digit: string, prefix: string): AccountModel | Promise<AccountModel>;

  create(cmd: Partial<AccountModel>): AccountModel | Promise<AccountModel>;

  requireNewPassword(id: string): boolean | Promise<boolean>;

  setLastLogin(id: string, ip?: string): boolean | Promise<boolean>;

  unlock(id: string): boolean | Promise<boolean>;

  lock(id: string): boolean | Promise<boolean>;

  setPassword(id: string, password: string): boolean | Promise<boolean>;

  delete(id: string): AccountModel | Promise<AccountModel>;

  update(
    id: string,
    cmd: Partial<AccountModel>,
  ): AccountModel | Promise<AccountModel>;
}
