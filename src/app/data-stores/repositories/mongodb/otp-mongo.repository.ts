import { Collection, Db } from 'mongodb';
import { FeaturesConfig } from '../../../common';
import { DatabaseTables } from '../../stores/store.helpers';
import { OtpRepositoryContract } from '../otp-repository.contract';

export class OtpMongoRepository implements OtpRepositoryContract {
  collection: Collection;

  constructor(private readonly db: Db, private readonly featuresConfig: FeaturesConfig) {
    this.collection = db.collection(DatabaseTables.otp.name);
  }

  findByAccountID(email: string) {}

  findByID(id: string) {}

  create(username: string) {}
}
