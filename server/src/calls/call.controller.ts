import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { CallService } from './call.service';
import { CallInsertDto, CallUpdateDto } from './call.type';

@Controller('calls')
export class CallsController {
  constructor(private readonly callService: CallService) {}

  // POST /calls - Create a new call
  @Post()
  createCall(@Body() data: CallInsertDto) {
    return this.callService.createCall(data);
  }

  // GET /calls/:id - Get a specific call by ID
  @Get(':id')
  getCallById(@Param('id') id: string) {
    return this.callService.getCallById(id);
  }

  // GET /calls/call-reports - Get all call reports
  @Get('call-reports')
  getAllCallReports() {
    return this.callService.findAll();
  }

  // GET /calls - Get all calls with optional status filter
  @Get()
  getAllCalls() {
    return this.callService.getAllCalls();
  }

  // PATCH /calls/:id - Update a specific call by ID
  @Patch(':id')
  updateCall(@Param('id') id: string, @Body() data: CallUpdateDto) {
    return this.callService.update(id, data);
  }

  // DELETE /calls/:id - Delete a specific call by ID
  @Delete(':id')
  deleteCall(@Param('id') id: string) {
    return this.callService.delete(id);
  }
}
