import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * @description session response is a public representation of an session
 */
@ObjectType('session', {
  description: 'Session response is a public representation of an session',
})
export class SessionResponse {
  /**
   * @description ID field is a database generated unique identifier for an session
   */
  @Field({ description: 'ID field is a database generated unique identifier for an session'})
  @ApiProperty()
  id: string;

  /**
   * @description Email field is a unique but optional identity of an session
   */
  @Field({ description: 'Email field is a unique but optional identity of an session'})
  @ApiProperty()
  email?: string;

  /**
   * @description Username field is a unique but optional identity of an session
   */
  @Field({ description: 'Username field is a unique but optional identity of an session'})
  @ApiProperty()
  username?: string;

  /**
   * @description Mobile field is a unique but optional identity of an session
   */
  @Field({ description: 'Mobile field is a unique but optional identity of an session'})
  @ApiProperty()
  mobile?: string;
}
