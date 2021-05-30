import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import {
  DataStoreModuleAsyncOptions,
  DataStoreModuleOptions,
  DataStoreModuleOptionsFactory,
} from "./data-store.options";
import {
  createDatastoreProvider,
  createDatastoreProviderFactory,
} from "./create-datastore.provider";
import {
  DATA_STORE_CONFIG,
  DATA_STORE_CONFIG_OPTIONS,
} from "./data-store.constant";
import { ConfigModule } from "@ultimate-backend/config";

@Module({
  imports: [ConfigModule],
})
export class DataStoresModule {
  static forRoot(options?: DataStoreModuleOptions): DynamicModule {
    const storeProv = createDatastoreProvider(options);
    return {
      module: DataStoresModule,
      providers: [
        {
          provide: DATA_STORE_CONFIG,
          useValue: options,
        },
        storeProv,
      ],
      exports: [storeProv],
      global: true,
    };
  }

  static forRootAsync(options: DataStoreModuleAsyncOptions): DynamicModule {
    const storeProvider = createDatastoreProviderFactory();
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: DataStoresModule,
      imports: options.imports,
      providers: [
        {
          provide: DATA_STORE_CONFIG,
          useValue: options,
        },
        ...asyncProviders,
        storeProvider,
      ],
      exports: [storeProvider],
      global: true,
    };
  }

  private static createAsyncProviders(
    options: DataStoreModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<DataStoreModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: DataStoreModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: DATA_STORE_CONFIG_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<DataStoreModuleOptionsFactory>,
    ];
    return {
      provide: DATA_STORE_CONFIG_OPTIONS,
      useFactory: async (optionsFactory: DataStoreModuleOptionsFactory) =>
        await optionsFactory.createDataStoreOptions(),
      inject,
    };
  }
}
