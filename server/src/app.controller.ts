import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // GET / - Default route
  @Get()
  get() {
    console.log('Default URL accessed');
    return 'Jaydennn';
  }
}
