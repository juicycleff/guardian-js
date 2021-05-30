import { Module } from "@nestjs/common";
import { SessionsController } from "./sessions.controller";
import { SessionsResolver } from "./sessions.resolver";
import { SessionsService } from "./sessions.service";

@Module({
  controllers: [SessionsController],
  providers: [SessionsResolver, SessionsService],
})
export class SessionsModule {}
