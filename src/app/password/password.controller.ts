import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordScoreRequest } from './commands';
import { PasswordService } from './password.service';

@ApiTags('password')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('/reset')
  reset() {
    return;
  }

  @Post('/score')
  score(@Body() body: PasswordScoreRequest): string {
    return this.passwordService.scorePassword(body.password);
  }
}
