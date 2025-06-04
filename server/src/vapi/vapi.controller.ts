import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { VapiService } from './vapi.service';

@Controller('vapi')
export class VapiController {
  constructor(private readonly vapiService: VapiService) {}

  @Post('calls')
  async createCall(@Body() createCallDto: any) {
    return this.vapiService.createCall(createCallDto);
  }

  @Get('calls')
  async getCalls() {
    return this.vapiService.syncCalls();
  }

  @Get('calls/:id')
  async getCall(@Param('id') id: string) {
    return this.vapiService.getCall(id);
  }

  @Get('calls/sync')
  async syncCalls() {
    return this.vapiService.syncCalls();
  }

  @Delete('calls/:id')
  async deleteCall(@Param('id') id: string) {
    return this.vapiService.deleteCall(id);
  }

  @Post('assistants')
  async createAssistant(@Body() createAssistantDto: any) {
    return this.vapiService.createAssistant(createAssistantDto);
  }

  @Get('assistants')
  async getAssistants() {
    return this.vapiService.syncAssitants();
  }

  @Get('assistants/:id')
  async getAssistant(@Param('id') id: string) {
    return this.vapiService.getAssistant(id);
  }

  @Put('assistants/:id')
  async updateAssistant(
    @Param('id') id: string,
    @Body() updateAssistantDto: any,
  ) {
    return this.vapiService.updateAssistant(id, updateAssistantDto);
  }

  @Delete('assistants/:id')
  async deleteAssistant(@Param('id') id: string) {
    return this.vapiService.deleteAssistant(id);
  }

  @Post('webhooks')
  async handleWebhook(@Body() webhookData: any) {
    return await this.vapiService.handleWebhook(webhookData);
  }
}
