import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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
      if (
        error.message?.includes('validation') ||
        error.message?.includes('invalid')
      ) {
        throw new BadRequestException('Invalid call data provided');
      }
      throw new InternalServerErrorException('Failed to create call');
    }
  }

  // GET /calls/stats - All call stats
  @Get('/stats')
  async getAllCallStats() {
    try {
      return await this.callService.getAllCallsStats();
    } catch (error) {
      this.logger.error('Error getting all call reports:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve call statistics',
      );
    }
  }

  // GET /calls/:id - Get a specific call by ID
  @Get(':id')
  async getCallById(@Param('id') id: string) {
    try {
      return await this.callService.getCallById(id);
    } catch (error) {
      this.logger.error(`Error getting call by id ${id}:`, error);
      if (
        error.message?.includes('not_found') ||
        error.message?.includes('not found')
      ) {
        throw new NotFoundException(`Call with ID ${id} not found`);
      }
      if (
        error.message?.includes('invalid') ||
        error.message?.includes('validation')
      ) {
        throw new BadRequestException('Invalid call ID provided');
      }
      throw new InternalServerErrorException('Failed to retrieve call');
    }
  }

  // GET /calls - Get all calls with optional status filter
  @Get()
  async getAllCalls() {
    try {
      return await this.callService.getAllCalls();
    } catch (error) {
      this.logger.error('Error getting all calls:', error);
      throw new InternalServerErrorException('Failed to retrieve calls');
    }
  }

  // PATCH /calls/:id - Update a specific call by ID
  @Patch(':id')
  async updateCall(@Param('id') id: string, @Body() data: CallUpdateDto) {
    try {
      return await this.callService.update(id, data);
    } catch (error) {
      this.logger.error(`Error updating call ${id}:`, error);
      if (
        error.message?.includes('not_found') ||
        error.message?.includes('not found')
      ) {
        throw new NotFoundException(`Call with ID ${id} not found`);
      }
      if (
        error.message?.includes('validation') ||
        error.message?.includes('invalid')
      ) {
        throw new BadRequestException('Invalid update data provided');
      }
      throw new InternalServerErrorException('Failed to update call');
    }
  }

  // DELETE /calls/:id - Delete a specific call by ID
  @Delete(':id')
  async deleteCall(@Param('id') id: string) {
    try {
      return await this.callService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting call ${id}:`, error);
      if (
        error.message?.includes('not_found') ||
        error.message?.includes('not found')
      ) {
        throw new NotFoundException(`Call with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete call');
    }
  }
}
