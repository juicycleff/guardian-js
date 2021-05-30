import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { PasswordResolver } from './password.resolver';

@Module({
  providers: [PasswordService, PasswordResolver],
  controllers: [PasswordController]
})
export class PasswordModule {}
