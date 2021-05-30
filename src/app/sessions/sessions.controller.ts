import { Body, Controller, Delete, Post, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAccountRequest } from '../accounts/commands';
import { IRequest } from '../common';
import { CreateSessionRequest, UpdateSessionRequest } from './commands';
import { SessionResponse } from './queries';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/')
  async create(
    @Body() body: CreateSessionRequest,
    @Req() req: IRequest,
  ): Promise<SessionResponse> {
    return await this.sessionsService.create(body, req.identity);
  }

  @Put('/')
  update(@Body() body: UpdateSessionRequest) {
    return;
  }

  @Delete('/')
  delete(@Req() req: IRequest): boolean {
    return this.sessionsService.delete(req.identity);
  }

  @Put('/refresh')
  refresh(@Body() body: UpdateAccountRequest) {
    return;
  }
}
