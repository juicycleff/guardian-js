import { Injectable } from "@nestjs/common";
import { ConfigValue } from "@ultimate-backend/config";
import { FeaturesConfig } from "../common";

@Injectable()
export class AccountsService {
  @ConfigValue("features", {})
  featuresConfig: FeaturesConfig;

  createAccount() {
    console.log("onModuleInit", this.featuresConfig);
  }
}
