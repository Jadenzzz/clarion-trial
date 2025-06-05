import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateAssistantDto, UpdateAssistantDto } from './assistant.type';

@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  async getAllAssistants() {
    try {
      return this.assistantService.getAllAssistants();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get assistants',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getAssistantById(@Param('id') id: string) {
    try {
      return this.assistantService.getAssistantById(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get assistant',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createAssistantDto: CreateAssistantDto) {
    try {
      return this.assistantService.create(createAssistantDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create assistant',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ) {
    try {
      return this.assistantService.update(id, updateAssistantDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update assistant',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.assistantService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to remove assistant',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
