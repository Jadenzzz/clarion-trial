import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VapiController } from './vapi.controller';
import { VapiService } from './vapi.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [HttpModule, SupabaseModule],
  controllers: [VapiController],
  providers: [VapiService],
  exports: [VapiService],
})
export class VapiModule {}
