import {Body, Controller, Delete, Get, Patch, Post, Put} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateAccountRequest, UpdateAccountRequest } from "./commands";

@ApiTags("accounts")
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get("/")
  getAccount() {
    return;
  }

  @Post("/")
  create(@Body() body: CreateAccountRequest) {
    return;
  }

  @Patch("/")
  updatePatch(@Body() body: UpdateAccountRequest) {
    return;
  }

  @Put("/")
  update(@Body() body: UpdateAccountRequest) {
    return;
  }

  @Get("/available")
  available(@Body() body: UpdateAccountRequest) {
    return;
  }

  @Get("/token")
  token(@Body() body: UpdateAccountRequest) {
    return;
  }

  @Get("/import")
  import() {
    return;
  }

  @Put("/lock")
  lock() {
    return;
  }

  @Put("/unlock")
  unlock() {
    return;
  }

  @Put("/expire_password")
  expirePassword() {
    return;
  }

  @Delete("/")
  delete() {
    this.accountService.createAccount();
  }
}
