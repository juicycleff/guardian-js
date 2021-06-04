import { Body, Controller, Delete, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAccountRequest } from '../accounts/commands';
import { IRequest, Secure } from '../common';
import { CreateSessionRequest, UpdateSessionRequest } from './commands';
import { SessionResponse } from './queries';
import { SessionsService } from './sessions.service';

@ApiBearerAuth()
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

  @Secure({ claim: 'account' })
  @Put('/')
  update(@Body() body: UpdateSessionRequest) {
    return;
  }

  @Secure({ claim: 'account' })
  @Delete('/')
  delete(@Req() req: IRequest): boolean {
    return this.sessionsService.delete(req.identity);
  }

  @Secure({ claim: 'account' })
  @Put('/refresh')
  refresh(@Body() body: UpdateAccountRequest) {
    return;
  }
}
