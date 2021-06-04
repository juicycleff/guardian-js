import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DataSchemaConstrains {
  @Field(() => Int, { nullable: true })
  maxValue?: number;

  @Field(() => Int, { nullable: true })
  minValue?: number;
}

@ObjectType()
export class IGuardianSchema {
  @Field({ nullable: true })
  dataType?: 'String' | 'Number';

  @Field({ nullable: true })
  developmentOnly?: boolean;

  @Field({ nullable: true, defaultValue: true })
  mutable?: boolean;

  @Field()
  name: string;

  @Field({ nullable: true, defaultValue: false })
  required?: boolean;

  @Field({ nullable: true })
  constraints?: DataSchemaConstrains;
}
