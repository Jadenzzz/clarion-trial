import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { UsersService } from './users.service';
import z from 'zod';
import { User, userSchema } from './user.schema';
import { Logger } from '@nestjs/common';

@Router({ alias: 'users' })
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({ input: z.object({ name: z.string(), email: z.string() }) })
  createUser(@Input() data: User) {
    return this.usersService.createUser(data);
  }

  @Query({ input: z.object({ id: z.string() }) })
  getUserById(@Input('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query({ output: z.array(userSchema) })
  getAllUsers() {
    Logger.log('works?');
    return this.usersService.findAll();
  }
}
