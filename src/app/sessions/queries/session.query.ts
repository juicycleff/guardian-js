import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * @description account response is a public representation of an account
 */
@ObjectType('account', {
  description: 'Account response is a public representation of an account',
})
export class AccountResponse {
  /**
   * @description ID field is a database generated unique identifier for an account
   */
  @Field({ description: 'ID field is a database generated unique identifier for an account'})
  @ApiProperty()
  id: string;

  /**
   * @description Email field is a unique but optional identity of an account
   */
  @Field({ description: 'Email field is a unique but optional identity of an account'})
  @ApiProperty()
  email?: string;

  /**
   * @description Username field is a unique but optional identity of an account
   */
  @Field({ description: 'Username field is a unique but optional identity of an account'})
  @ApiProperty()
  username?: string;

  /**
   * @description Mobile field is a unique but optional identity of an account
   */
  @Field({ description: 'Mobile field is a unique but optional identity of an account'})
  @ApiProperty()
  mobile?: string;
}