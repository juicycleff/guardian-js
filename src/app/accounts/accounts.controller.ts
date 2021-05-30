import { Body, Controller, Delete, Get, Patch, Post, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Identity, Secure } from '../common';
import { Auth } from '../common';
import { AccountsService } from './accounts.service';
import {
  AccountAvailableRequest,
  CreateAccountRequest,
  UpdateAccountRequest,
} from './commands';
import { AccountResponse } from './queries';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  /**
   * Retrieves the current logged in account or throws a 401 response
   */
  @Get('/')
  @Secure({ claim: 'account' })
  async getAccount(@Auth() identity: Identity): Promise<AccountResponse> {
    const rsp = await this.accountService.findByIdentity(identity.accountID, 'id');
    return rsp.toResponse();
  }

  @Post('/')
  async create(@Body() body: CreateAccountRequest): Promise<AccountResponse> {
    const resp = await this.accountService.create(body);
    return resp.toResponse();
  }

  @Secure({ claim: 'account' })
  @Put('/')
  @Patch('/')
  update(@Body() body: UpdateAccountRequest) {
    return;
  }

  @Get('/available')
  async available(@Body() body: AccountAvailableRequest): Promise<boolean> {
    return await this.accountService.isAvailable(body.identity);
  }

  @Put('/import')
  import() {
    return;
  }

  @Secure({ claim: 'service' })
  @Put('/:accountId/lock')
  async lock(@Param('accountId') accountId: string): Promise<boolean> {
    return await this.accountService.lock(accountId);
  }

  @Secure({ claim: 'service' })
  @Put('/:accountId/unlock')
  async unlock(@Param('accountId') accountId: string): Promise<boolean> {
    return await this.accountService.unlock(accountId);
  }

  @Secure({ claim: 'service' })
  @Put('/:accountId/expirePassword')
  async expirePassword(@Param('accountId') accountId: string): Promise<boolean> {
    return await this.accountService.passwordExpire(accountId);
  }

  @Secure({ claim: 'account' })
  @Delete('/')
  async delete(@Auth() identity: Identity): Promise<boolean> {
    return await this.accountService.delete(identity);
  }
}
