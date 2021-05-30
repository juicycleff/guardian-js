import { AppService } from "./app.service";
import {ObjectType, Query, Resolver} from "@nestjs/graphql";
import {GuardianConfig} from "./common";

@ObjectType()
class AppType {}

@Resolver(of => AppType)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  version(): string {
    return this.appService.getVersion();
  }

  @Query(() => String)
  health(): string {
    return this.appService.getVersion();
  }

  @Query(() => GuardianConfig)
  configuration(): string {
    return this.appService.getConfig();
  }

}
