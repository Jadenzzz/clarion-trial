import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Logger,
} from '@nestjs/common';
import { CallService } from './call.service';
import { CallInsertDto, CallUpdateDto } from './call.type';

@Controller('calls')
export class CallsController {
  private readonly logger = new Logger(CallsController.name);

  constructor(private readonly callService: CallService) {}

  // POST /calls - Create a new call
  @Post()
  async createCall(@Body() data: CallInsertDto) {
    try {
      return await this.callService.createCall(data);
    } catch (error) {
      this.logger.error('Error creating call:', error);
      throw error;
    }
  }

  // GET /calls/:id - Get a specific call by ID
  @Get(':id')
  async getCallById(@Param('id') id: string) {
    try {
      return await this.callService.getCallById(id);
    } catch (error) {
      this.logger.error(`Error getting call by id ${id}:`, error);
      throw error;
    }
  }

  // GET /calls/call-reports - Get all call reports
  @Get('call-reports')
  async getAllCallReports() {
    try {
      return await this.callService.findAll();
    } catch (error) {
      this.logger.error('Error getting all call reports:', error);
      throw error;
    }
  }

  // GET /calls - Get all calls with optional status filter
  @Get()
  async getAllCalls() {
    try {
      return await this.callService.getAllCalls();
    } catch (error) {
      this.logger.error('Error getting all calls:', error);
      throw error;
    }
  }

  // PATCH /calls/:id - Update a specific call by ID
  @Patch(':id')
  async updateCall(@Param('id') id: string, @Body() data: CallUpdateDto) {
    try {
      return await this.callService.update(id, data);
    } catch (error) {
      this.logger.error(`Error updating call ${id}:`, error);
      throw error;
    }
  }

  // DELETE /calls/:id - Delete a specific call by ID
  @Delete(':id')
  async deleteCall(@Param('id') id: string) {
    try {
      return await this.callService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting call ${id}:`, error);
      throw error;
    }
  }
}
