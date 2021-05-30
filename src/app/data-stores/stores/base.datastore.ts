import { HealthStatus } from '../../common';
import { AccountRepositoryContract, OtpRepositoryContract } from '../repositories';

export abstract class BaseDatastore<T> {
  connect(): void | Promise<void> {
    throw new Error('Not implemented');
  }

  health(): HealthStatus | Promise<HealthStatus> {
    return 'IDLE';
  }

  private _client: T;
  public get client(): T {
    return this._client;
  }
  public set client(value: T) {
    this._client = value;
  }

  private _account: AccountRepositoryContract;
  public get account(): AccountRepositoryContract {
    return this._account;
  }
  public set account(value: AccountRepositoryContract) {
    this._account = value;
  }

  private _oneTimeCode: OtpRepositoryContract;
  public get oneTimeCode(): OtpRepositoryContract {
    return this._oneTimeCode;
  }
  public set oneTimeCode(value: OtpRepositoryContract) {
    this._oneTimeCode = value;
  }

  close(): void | Promise<void> {
    throw new Error('Not implemented');
  }
}
