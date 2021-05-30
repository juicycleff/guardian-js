import { Provider } from '@nestjs/common';
import { ConfigStore } from '@ultimate-backend/config';
import { DATA_STORE_CONFIG_OPTIONS } from './data-store.constant';
import { DataStoreModuleOptions } from './data-store.options';
import {
  BaseDatastore,
  MongoDatastoreProvider,
  MysqlDatastoreProvider,
  PostgresDatastoreProvider,
  SqliteDatastoreProvider,
} from './stores';

export function createDatastoreProvider(opts: DataStoreModuleOptions): Provider {
  const provider: Provider = {
    provide: BaseDatastore,
    useClass: null,
  };

  switch (opts?.driver) {
    case 'mysql':
      provider.useClass = MysqlDatastoreProvider;
      break;
    case 'mongodb':
      provider.useClass = MongoDatastoreProvider;
      break;
    case 'postgres':
      provider.useClass = PostgresDatastoreProvider;
      break;
    case 'sqlite':
      provider.useClass = SqliteDatastoreProvider;
      break;
    default:
      provider.useClass = SqliteDatastoreProvider;
      break;
  }

  return provider;
}

export function createDatastoreProviderFactory(): Provider {
  return {
    provide: BaseDatastore,
    useFactory: (modOpts: DataStoreModuleOptions) => {
      const ProvClass = (createDatastoreProvider(modOpts) as any).useClass;
      return new ProvClass();
    },
    inject: [DATA_STORE_CONFIG_OPTIONS, ConfigStore],
  };
}
