import { Body, Controller, Delete, Post, Put } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionRequest, UpdateSessionRequest } from "./commands";
import { ApiTags } from "@nestjs/swagger";
import {UpdateAccountRequest} from "../accounts/commands";

@ApiTags("sessions")
@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post("/")
  create(@Body() body: CreateSessionRequest) {
    return;
  }

  @Put("/")
  update(@Body() body: UpdateSessionRequest) {
    return;
  }

  @Delete("/")
  delete() {
    return;
  }

  @Put("/refresh")
  refresh(@Body() body: UpdateAccountRequest) {
    return;
  }
}
