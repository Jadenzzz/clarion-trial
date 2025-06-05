import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // GET / - Default route
  @Get()
  get() {
    return 'Jaydennn';
  }
}
