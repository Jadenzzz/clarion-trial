import { Controller, Get } from '@nestjs/common';

@Controller('calls')
export class CallsController {
  constructor() {}

  // GET /calls/:id - Get a specific call by ID
  @Get()
  get() {
    console.log('Hello world');
  }
}
