import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";
import {ApiTags} from "@nestjs/swagger";

@ApiTags("index")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/configuration')
  configuration() {
    return this.appService.getConfig();
  }

  @Get('/metrics')
  metrics() {
    return this.appService.getData();
  }

  @Get('/jwks')
  jwks() {
    return this.appService.getData();
  }

  @Get('/stats')
  stats() {
    return this.appService.getData();
  }
}
