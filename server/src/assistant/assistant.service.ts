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

  async getAllAssistants(userId?: string): Promise<Assistant[]> {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('assistant').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch assistants: ${error.message}`);
    }

    return data || [];
  }

  async getAllAssistantsWithStats(): Promise<Assistant[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('assistant')
      .select('*, call(id, status, transcript)');

    if (error) {
      throw new Error(`Failed to fetch assistants: ${error.message}`);
    }

    return data || [];
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
