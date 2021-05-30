import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType("CreateSessionInput")
export class CreateSessionRequest {
  /**
   * @description Identity field accepts a username, email or mobile of an account
   */
  @Field({ description: 'Identity field accepts a username, email or mobile of an account', nullable: true })
  @ApiProperty()
  identity: string;

  /**
   * @description This is the password used together with any identity to verify an account by the owner
   */
  @Field({ description: 'This is the password used together with any identity to verify an account by the owner' })
  @ApiProperty()
  password: string;
}

@InputType("UpdateSessionInput")
export class UpdateSessionRequest {
  /**
   * @description Identity field accepts a username, email or mobile of an account
   */
  @Field({ description: 'Identity field accepts a username, email or mobile of an account', nullable: true })
  @ApiProperty()
  identity?: string;
}
