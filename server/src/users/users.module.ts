import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRouter } from './users.router';

@Module({
  // controllers: [UsersController],
  providers: [UsersService, UsersRouter],
})
export class UsersModule {}
