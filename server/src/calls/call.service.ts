import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Database } from 'database.types';

@Injectable()
export class CallService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    // if (status) {
    //   query = query.eq('status', status);
    // }

    const { error, data } = await this.supabaseService
      .getClient()
      .from('call')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new NotFoundException(error.message);
    }

    if (status && (!data || data.length === 0)) {
      throw new NotFoundException('No calls found with the specified status');
    }

    return data || [];
  }

  async getCallById(id: string) {
    const { error, data } = await this.supabaseService
      .getClient()
      .from('call')
      .select('*, message(*), assistant(name)')
      .eq('id', id)
      .order('start_timestamp', { foreignTable: 'message', ascending: true })
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return data;
  }

  async createCall(data: Database['public']['Tables']['call']['Insert']) {
    const { error, data: newCall } = await this.supabaseService
      .getClient()
      .from('call')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return newCall;
  }

  async update(
    id: string,
    data: Database['public']['Tables']['call']['Update'],
  ) {
    const { error, data: updatedCall } = await this.supabaseService
      .getClient()
      .from('call')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return updatedCall;
  }

  async delete(id: string) {
    // First get the call to return it

    const { error } = await this.supabaseService
      .getClient()
      .from('call')
      .delete()
      .eq('id', id);

    if (error) {
      throw new NotFoundException(error.message);
    }

    return;
  }

  async getAllCalls() {
    const { error, data } = await this.supabaseService
      .getClient()
      .from('call')
      .select('*, assistant(name)');

    if (error) {
      throw new NotFoundException(error.message);
    }

    return data || [];
  }
}
