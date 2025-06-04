import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';
// import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [TRPCModule.forRoot({ autoSchemaFile: 'src/trpc/@generated' })],
  controllers: [TrpcPanelController],
  // providers: [LoggerMiddleware],
})
export class TrpcModule {}
