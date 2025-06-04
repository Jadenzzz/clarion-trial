import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from './user.schema';

@Injectable()
export class UsersService {
  private users = [
    {
      id: '1',
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      role: 'INTERN',
    },
    {
      id: '2',
      name: 'Ervin Howell',
      email: 'Shanna@melissa.tv',
      role: 'INTERN',
    },
    {
      id: '3',
      name: 'Clementine Bauch',
      email: 'Nathan@yesenia.net',
      role: 'ENGINEER',
    },
    {
      id: '4',
      name: 'Patricia Lebsack',
      email: 'Julianne.OConner@kory.org',
      role: 'ENGINEER',
    },
    {
      id: '5',
      name: 'Chelsey Dietrich',
      email: 'Lucio_Hettinger@annie.ca',
      role: 'ADMIN',
    },
  ];

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      const roles = this.users.filter((user) => user.role === role);

      if (!roles.length) {
        throw new NotFoundException('User Role Not Found');
      }
    }
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  createUser(data: User) {
    const newUser = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.users.push(newUser);
    return this.users;
  }

  update(id: string, updateUserDto: Partial<User>) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.findOne(id);
  }

  delete(id: string) {
    const removedUser = this.findOne(id);

    this.users = this.users.filter((user) => user.id !== id);

    return removedUser;
  }
}
