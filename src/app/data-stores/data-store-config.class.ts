import { Injectable } from '@nestjs/common';
import {
  DataStoreModuleOptions,
  DataStoreModuleOptionsFactory,
} from './data-store.options';

@Injectable()
export class DataStoreConfigClass implements DataStoreModuleOptionsFactory {
  createDataStoreOptions(): Promise<DataStoreModuleOptions> | DataStoreModuleOptions {
    return {
      driver: 'mongodb',
    };
  }
}
