import { Injectable } from "@nestjs/common";
import {ConfigStore} from "@ultimate-backend/config";
import {BootConfig} from "@ultimate-backend/bootstrap";

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigStore,
    private readonly boot: BootConfig
  ) {}

  getConfig() {
    return this.config.cache;
  }

  getVersion(): string {
    return this.boot.get('version');
  }

  getData(): { message: string } {
    return { message: "Welcome to guardian!" };
  }
}
