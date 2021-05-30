import { ObjectType, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { GuardianConfig, HealthStatusResponse, Secure } from './common';

@ObjectType()
class AppType {}

@Resolver((of) => AppType)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  version(): string {
    return this.appService.getVersion();
  }

  @Query(() => HealthStatusResponse)
  async health(): Promise<HealthStatusResponse> {
    return await this.appService.getHealthStatus();
  }

  @Secure({ claim: 'service' })
  @Query(() => String)
  metrics(): string {
    return 'metrics';
  }

  @Query(() => GuardianConfig)
  configuration(): GuardianConfig {
    return this.appService.getConfig();
  }
}
