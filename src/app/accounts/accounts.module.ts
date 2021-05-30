import { Module } from "@nestjs/common";

import { AccountsController } from "./accounts.controller";
import { AccountsResolver } from "./accounts.resolver";
import { AccountsService } from "./accounts.service";
import { AccountRepository } from "../data-stores";

@Module({
  providers: [AccountsService, AccountsResolver, AccountRepository],
  controllers: [AccountsController],
})
export class AccountsModule {}
