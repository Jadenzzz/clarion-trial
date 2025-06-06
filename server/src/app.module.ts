import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { CallsModule } from './calls/calls.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

import { SupabaseModule } from './supabase/supabase.module';
import { VapiModule } from './vapi/vapi.module';
import { AssistantModule } from './assistant/assistant.module';
import { AppController } from './app.controller';

@Module({
  imports: [CallsModule, SupabaseModule, VapiModule, AssistantModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/*splat', method: RequestMethod.PATCH });
  }
}
