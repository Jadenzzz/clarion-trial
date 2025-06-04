import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateAssistantDto, UpdateAssistantDto } from './assistant.type';

@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  async getAllAssistants(
    @Query('userId') userId?: string,
    @Query('stats') stats?: string,
  ) {
    if (stats) {
      return this.assistantService.getAllAssistantsWithStats();
    }
    return this.assistantService.getAllAssistants(userId);
  }

  @Get(':id')
  async getAssistantById(@Param('id') id: string) {
    return this.assistantService.getAssistantById(id);
  }

  @Post()
  async create(@Body() createAssistantDto: CreateAssistantDto) {
    return this.assistantService.create(createAssistantDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ) {
    return this.assistantService.update(id, updateAssistantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assistantService.remove(id);
  }
}
