import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Logger,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { VapiService } from './vapi.service';

@Controller('vapi')
export class VapiController {
  private readonly logger = new Logger(VapiController.name);

  constructor(private readonly vapiService: VapiService) {}

  @Post('calls')
  async createCall(@Body() createCallDto: any) {
    try {
      return await this.vapiService.createCall(createCallDto);
    } catch (error) {
      this.logger.error('Failed to create call', error);
      throw new HttpException(
        'Failed to create call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('calls')
  async getCalls() {
    try {
      return await this.vapiService.syncCalls();
    } catch (error) {
      this.logger.error('Failed to get calls', error);
      throw new HttpException(
        'Failed to get calls',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('calls/:id')
  async getCall(@Param('id') id: string) {
    try {
      return await this.vapiService.getCall(id);
    } catch (error) {
      this.logger.error(`Failed to get call with id: ${id}`, error);
      throw new HttpException(
        'Failed to get call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('calls/sync')
  async syncCalls() {
    try {
      return await this.vapiService.syncCalls();
    } catch (error) {
      this.logger.error('Failed to sync calls', error);
      throw new HttpException(
        'Failed to sync calls',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('calls/:id')
  async deleteCall(@Param('id') id: string) {
    try {
      return await this.vapiService.deleteCall(id);
    } catch (error) {
      this.logger.error(`Failed to delete call with id: ${id}`, error);
      throw new HttpException(
        'Failed to delete call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('assistants')
  async createAssistant(@Body() createAssistantDto: any) {
    try {
      return await this.vapiService.createAssistant(createAssistantDto);
    } catch (error) {
      this.logger.error('Failed to create assistant', error);
      throw new HttpException(
        'Failed to create assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('assistants')
  async getAssistants() {
    try {
      return await this.vapiService.syncAssitants();
    } catch (error) {
      this.logger.error('Failed to get assistants', error);
      throw new HttpException(
        'Failed to get assistants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('assistants/:id')
  async getAssistant(@Param('id') id: string) {
    try {
      return await this.vapiService.getAssistant(id);
    } catch (error) {
      this.logger.error(`Failed to get assistant with id: ${id}`, error);
      throw new HttpException(
        'Failed to get assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('assistants/:id')
  async updateAssistant(
    @Param('id') id: string,
    @Body() updateAssistantDto: any,
  ) {
    try {
      return await this.vapiService.updateAssistant(id, updateAssistantDto);
    } catch (error) {
      this.logger.error(`Failed to update assistant with id: ${id}`, error);
      throw new HttpException(
        'Failed to update assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('assistants/:id')
  async deleteAssistant(@Param('id') id: string) {
    try {
      return await this.vapiService.deleteAssistant(id);
    } catch (error) {
      this.logger.error(`Failed to delete assistant with id: ${id}`, error);
      throw new HttpException(
        'Failed to delete assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('webhooks')
  async handleWebhook(
    @Body() webhookData: any,
    @Headers('X-VAPI-SECRET') signature: string,
  ) {
    try {
      // Authenticate webhook using secret token
      const secret_token = process.env.VAPI_WEBHOOK_SECRET;
      if (!secret_token) {
        this.logger.error('VAPI_WEBHOOK_SECRET not configured');
        throw new HttpException(
          'Webhook authentication not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!signature || signature !== secret_token) {
        this.logger.warn(`Invalid webhook signature received ${signature}`);
        throw new UnauthorizedException('Invalid webhook signature');
      }

      return await this.vapiService.handleWebhook(webhookData);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Failed to handle webhook', error);
      throw new HttpException(
        'Failed to handle webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
