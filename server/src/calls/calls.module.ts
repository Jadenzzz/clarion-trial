import { Module } from '@nestjs/common';
import { CallService } from './call.service';

import { CallsController } from './call.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [CallService],
  controllers: [CallsController],
})
export class CallsModule {}
