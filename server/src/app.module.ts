import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TrpcModule } from './trpc/trpc.module';
import { CallsModule } from './calls/calls.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

import { SupabaseModule } from './supabase/supabase.module';
import { VapiModule } from './vapi/vapi.module';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [
    UsersModule,
    TrpcModule,
    CallsModule,
    SupabaseModule,
    VapiModule,
    AssistantModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/*splat', method: RequestMethod.PATCH });
  }
}
