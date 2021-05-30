import {Controller, Get, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags("password")
@Controller('password')
export class PasswordController {
  @Get('/reset')
  reset() {
    return;
  }

  @Post('/score')
  score() {
    return;
  }
}
