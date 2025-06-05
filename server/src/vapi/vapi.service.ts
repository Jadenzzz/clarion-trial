import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Database } from 'database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  VapiEndOfCallReportMessage,
  VapiHangMessage,
  VapiStatusUpdateMessage,
} from './vapi.type';
@Injectable()
export class VapiService {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string = 'https://api.vapi.ai';
  private readonly supabaseClient: SupabaseClient<Database>;

  constructor(private readonly supabaseService: SupabaseService) {
    this.apiKey = process.env.VAPI_PRIVATE_KEY;
    this.supabaseClient = supabaseService.getClient();
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY environment variable is required');
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpException(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }
    return response.json();
  }

  async createCall(createCallDto: any) {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(createCallDto),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCalls() {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get calls',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCall(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/call/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCall(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/call/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAssistant(createAssistantDto: any) {
    try {
      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(createAssistantDto),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssistants() {
    try {
      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get assistants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async syncAssitants() {
    try {
      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const vapi_assistants: any = await this.handleResponse(response);

      const mapped_assistant = vapi_assistants.map((assistant) => {
        return {
          vapi_id: assistant.id as string,
          name: assistant.name as string,
          voice_id: assistant.voice.voiceId as string,
          voice_provider: assistant.voice.provider as string,
          model: assistant.model.model as string,
          model_provider: assistant.model.provider as string,
          phone_number: null,
        };
      });
      // Upsert assistants to database using Supabase client
      try {
        for (const assistant of mapped_assistant) {
          console.log(assistant);
          if (!assistant.vapi_id) continue;
          if (!this.supabaseClient) {
            console.log('Instance not found');
          }
          await this.supabaseClient
            .from('assistant')
            .insert(
              assistant as Database['public']['Tables']['assistant']['Insert'],
            );
        }
      } catch (error) {
        console.error('Failed to upsert assistants to database:', error);
        throw error;
      }

      return mapped_assistant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get assistants',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async syncCalls() {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const vapi_calls: any = await this.handleResponse(response);

      const mapped_calls = vapi_calls.map((call) => {
        return {
          vapi_id: call.id as string,
          assistant_vapi_id: call.assistantId as string,
          name: call.name as string,
          type: call.type as string,
          cost: call.cost as number,
          status: call.status as string,
          started_at: new Date(call.startedAt as string),
          ended_at: new Date(call.endedAt as string),
          phone_number: call.phoneNumber ?? null,
          phone_number_id: call.phoneNumberId ?? null,
          recording_url: call.recordingUrl ?? null,
          summary: call.summary ?? null,
          transcript: call.transcript ?? null,
          ended_reason: call.endedReason ?? null,
          messages: call.messages.map((msg) => ({
            role: msg.role,
            message: msg.message,
            start_timestamp: msg.time,
            end_timestamp: msg.endTime ?? null,
          })),
        };
      });

      const { data: all_assistants } = await this.supabaseClient
        .from('assistant')
        .select('vapi_id, id');
      // Upsert assistants to database using Supabase client
      try {
        for (const call of mapped_calls) {
          if (!call.vapi_id) continue;
          if (!this.supabaseClient) {
            console.log('Instance not found');
          }
          const assistant_id = all_assistants?.find(
            (assistant) => assistant.vapi_id === call.assistant_vapi_id,
          )?.id;
          if (!assistant_id) {
            continue;
          }
          const { data: updated_call, error } = await this.supabaseClient
            .from('call')
            .upsert(
              {
                vapi_id: call.vapi_id,
                assistant_id: assistant_id,
                name: call.name,
                type: call.type,
                cost: call.cost,
                status: call.status,
                started_at: call.started_at,
                ended_at: call.ended_at,
                phone_number: call.phone_number,
                phone_number_id: call.phone_number_id,
                recording_url: call.recording_url,
                summary: call.summary,
                ended_reason: call.ended_reason,
                transcript: call.transcript,
              } as Database['public']['Tables']['call']['Insert'],
              {
                onConflict: 'vapi_id',
              },
            )
            .eq('vapi_id', call.vapi_id as string)
            .select('*, message(*)')
            .single();

          if (error) {
            console.error('Failed to sync call:', error);
          }
          if (updated_call?.message.length === 0) {
            for (const message of call.messages) {
              const { error: message_error } = await this.supabaseClient
                .from('message')
                .insert({
                  call_id: updated_call.id,
                  role: message.role,
                  message: message.message,
                  start_timestamp: message.start_timestamp,
                  end_timestamp: message.end_timestamp,
                });

              if (message_error) {
                console.error('Failed to insert message:', message_error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to sync calls to database:', error);
        throw error;
      }

      return mapped_calls;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get calls',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssistant(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/assistant/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAssistant(id: string, updateAssistantDto: any) {
    try {
      const response = await fetch(`${this.baseUrl}/assistant/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updateAssistantDto),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAssistant(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/assistant/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(webhookData: any) {
    // Process webhook data from VAPI

    const message = webhookData.message;
    if (message.type == 'status-udpate') {
      console.log('Received webhook:', webhookData);
    }

    // Handle different webhook events
    switch (message.type) {
      case 'status-update':
        return await this.handleStatusUpdate(
          message as VapiStatusUpdateMessage,
        );
      case 'end-of-call-report':
        return await this.handleEndOfCallReport(
          message as VapiEndOfCallReportMessage,
        );
      case 'hang':
        return this.handleHang(message as VapiHangMessage);
      default:
        console.log('Unknown webhook type:', message.type);
        return { success: true };
    }
  }
  async handleStatusUpdate(message: VapiStatusUpdateMessage) {
    console.log(`Call ${message.call.id} status update:`, message.status);

    const call = message.call;
    console.log(call);

    switch (message.status) {
      case 'in-progress': {
        const supabase = this.supabaseClient;

        if (!call.assistantId) {
          return;
        }

        const { data: assistant } = await supabase
          .from('assistant')
          .select('*')
          .eq('vapi_id', call.assistantId)
          .single();

        const { data: new_call, error } = await supabase.from('call').insert({
          vapi_id: call.id,
          assistant_id: assistant?.id || '',
          phone_call_transport: message.call.phoneCallTransport || null,
          status: 'in-progress',
          type: call.type,
        });

        if (error) {
          throw new Error(`Failed to insert call: ${error.message}`);
        }

        console.log(new_call);

        break;
      }
      case 'forwarding':
        // Handle call forwarding
        try {
          const { error } = await this.supabaseClient
            .from('call')
            .update({ status: 'forwarding' })
            .eq('vapi_id', call.id);

          if (error) {
            throw new Error(
              `Failed to update call status to forwarding: ${error.message}`,
            );
          }
        } catch (error) {
          console.error('Failed to update call status to forwarding:', error);
        }
        break;

      case 'ended':
        // Handle call ended
        try {
          const { error } = await this.supabaseClient
            .from('call')
            .update({
              status: 'ended',
              ended_reason: call.endedReason,
            })
            .eq('vapi_id', call.id);

          if (error) {
            throw new Error(
              `Failed to update call status to ended: ${error.message}`,
            );
          }
        } catch (error) {
          console.error('Failed to update call status to ended:', error);
        }
        break;

      default:
        console.warn('Unknown status:', message.status);
    }
  }
  async handleEndOfCallReport(message: VapiEndOfCallReportMessage) {
    console.log('End of call report:', message);

    const recording = this.handleDownloadRecording(message.recordingUrl || '');

    const { data: updated_call, error: updated_call_error } =
      await this.supabaseClient
        .from('call')
        .update({
          ended_reason: message.endedReason,
          summary: message.summary,
          transcript: message.transcript,
          recording_url: recording,
          started_at: message.startedAt,
          ended_at: message.endedAt,
          cost: message.cost,
        })
        .eq('vapi_id', message.call.id)
        .select('id');

    if (updated_call_error) {
      throw new Error(
        `Failed to update call report: ${updated_call_error.message}`,
      );
    }

    const messages = message.messages;

    if (messages && messages.length > 0 && !!updated_call[0].id) {
      for (const msg of messages) {
        if (!msg.message) {
          continue;
        }
        const { error: message_error } = await this.supabaseClient
          .from('message')
          .insert({
            call_id: updated_call[0].id,
            role: msg.role,
            message: msg.message,
            start_timestamp: msg.time,
            end_timestamp: msg.endTime ?? null,
          });

        if (message_error) {
          console.error('Failed to insert message:', message_error);
        }
      }
    }

    return updated_call;
  }

  handleDownloadRecording(link: string) {
    return link;
  }
  handleHang(message: VapiHangMessage) {
    console.log('Hang detected for call:', message.call.id);
  }
}
