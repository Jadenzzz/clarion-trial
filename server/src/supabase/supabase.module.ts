import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule, ConfigModule.forRoot()],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
