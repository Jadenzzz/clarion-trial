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

  async getAllCallsStats() {
    try {
      const { error: calls_error, data: calls } = await this.supabaseService
        .getClient()
        .from('call')
        .select('ended_reason, started_at, ended_at');

      if (calls_error) {
        throw new Error(`Failed to fetch calls: ${calls_error.message}`);
      }

      const { error: assistants_error, data: assistants } =
        await this.supabaseService.getClient().from('assistant').select('id');
      const assistant_count = assistants?.length || 0;

      if (assistants_error) {
        throw new Error(
          `Failed to fetch assistants: ${assistants_error.message}`,
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday_calls =
        calls?.filter(
          (call) => call.started_at && new Date(call.started_at) < today,
        ) || [];

      const total_count = calls?.length || 0;
      const yesterday_total_count = yesterday_calls?.length || 0;

      const success_rate = Math.round(
        ((calls?.filter((call) => !call.ended_reason?.includes('error'))
          .length || 0) /
          (total_count || 1)) *
          100,
      );

      const yesterday_success_rate = Math.round(
        ((yesterday_calls?.filter(
          (call) => !call.ended_reason?.includes('error'),
        ).length || 0) /
          (yesterday_total_count || 1)) *
          100,
      );

      const avg_duration = Math.round(
        (calls?.reduce((acc, call) => {
          if (!call.ended_at || !call.started_at) return acc;
          const duration =
            new Date(call.ended_at).getTime() -
            new Date(call.started_at).getTime();
          return acc + duration;
        }, 0) || 0) /
          (total_count || 1) /
          1000,
      );

      const yesterday_avg_duration = Math.round(
        (yesterday_calls?.reduce((acc, call) => {
          if (!call.ended_at || !call.started_at) return acc;
          const duration =
            new Date(call.ended_at).getTime() -
            new Date(call.started_at).getTime();
          return acc + duration;
        }, 0) || 0) /
          (yesterday_total_count || 1) /
          1000,
      );

      return {
        total_count,
        yesterday_total_count,
        success_rate,
        yesterday_success_rate,
        avg_duration,
        yesterday_avg_duration,
        assistant_count,
      };
    } catch (error) {
      throw new Error(`Failed to get call stats: ${error.message}`);
    }
  }
}
