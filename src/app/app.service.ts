import { Injectable } from '@nestjs/common';
import { BootConfig } from '@ultimate-backend/bootstrap';
import { ConfigStore } from '@ultimate-backend/config';
import { GuardianConfig, HealthStatusResponse } from './common';
import { BaseDatastore } from './data-stores/stores';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigStore,
    private readonly boot: BootConfig,
    private readonly datastore: BaseDatastore<any>,
  ) {}

  getConfig(): GuardianConfig {
    return this.config.cache;
  }

  getVersion(): string {
    return this.boot.get('version');
  }

  getData(): { message: string } {
    return { message: 'Welcome to guardian!' };
  }

  async getHealthStatus(): Promise<HealthStatusResponse> {
    return {
      status: 'OK',
      version: this.boot.get('version'),
      database: await this.datastore.health(),
    };
  }
}
