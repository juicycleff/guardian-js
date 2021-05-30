import { Module } from '@nestjs/common';
import { PasswordModule } from '../password/password.module';
import { AccountsMutationResolver } from './accounts-mutation.resolver';
import { AccountsQueriesResolver } from './accounts-queries.resolver';
import { AccountsController } from './accounts.controller';
import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';

@Module({
  imports: [PasswordModule],
  providers: [
    AccountsService,
    AccountsResolver,
    AccountsMutationResolver,
    AccountsQueriesResolver,
  ],
  controllers: [AccountsController],
})
export class AccountsModule {}
