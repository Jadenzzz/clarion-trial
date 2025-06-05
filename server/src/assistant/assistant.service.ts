import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  Assistant,
  CreateAssistantDto,
  UpdateAssistantDto,
} from './assistant.type';

@Injectable()
export class AssistantService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllAssistants(): Promise<Assistant[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('assistant')
      .select('*, call(ended_reason, started_at, ended_at)');

    const mapped_assistants = data?.map((assistant) => {
      const total_calls = assistant.call?.length || 0;
      const avg_call_duration = Math.round(
        assistant.call?.reduce((acc, call) => {
          if (!call?.started_at || !call?.ended_at) return acc;
          const duration =
            (new Date(call.ended_at).getTime() -
              new Date(call.started_at).getTime()) /
            1000;
          return acc + duration;
        }, 0) / (total_calls || 1),
      );

      const success_rate = Number(
        (
          (assistant.call?.reduce((acc, call) => {
            if (!call?.ended_reason) return acc;
            return (
              acc + (call.ended_reason.toLowerCase().includes('error') ? 0 : 1)
            );
          }, 0) /
            (total_calls || 1)) *
          100
        ).toFixed(1),
      );
      return { ...assistant, total_calls, avg_call_duration, success_rate };
    });

    if (error) {
      throw new Error(`Failed to fetch assistants: ${error.message}`);
    }

    return mapped_assistants || [];
  }

  async getAssistantById(id: string): Promise<Assistant> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('assistant')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch assistant: ${error.message}`);
    }

    return data;
  }

  async create(createAssistantDto: CreateAssistantDto): Promise<Assistant> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('assistant')
      .insert(createAssistantDto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create assistant: ${error.message}`);
    }

    return data;
  }

  async update(
    id: string,
    updateAssistantDto: UpdateAssistantDto,
  ): Promise<Assistant> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('assistant')
      .update(updateAssistantDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update assistant: ${error.message}`);
    }

    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.from('assistant').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete assistant: ${error.message}`);
    }

    return { message: 'Assistant deleted successfully' };
  }
}
