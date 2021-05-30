import { Db, Collection } from 'mongodb';
import { DatabaseTables } from '../stores/store.helpers';

export class AccountMongoRepository {
  collection: Collection;

  constructor(private readonly db: Db) {
    this.collection = db.collection(DatabaseTables.accounts);
  }

  findByUsername(username: string): {

  }

  findByEmail(email: string): {

  }

  findById(id: string): {

  }

  findByIdentity(id: string): {

  }

  findByMobile(digit: string, prefix: string): {

  }

  create(username: string): {

  }
}
