import { Field, ObjectType } from '@nestjs/graphql';

export type HealthStatus = 'PENDING' | 'READY' | 'DOWN_GRADED' | 'FAILING' | 'IDLE';

@ObjectType('HealthStatus')
export class HealthStatusResponse {
  @Field()
  database: HealthStatus;

  @Field()
  status: string;

  @Field()
  version: string;
}
