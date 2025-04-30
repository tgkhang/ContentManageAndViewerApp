import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johnny',
    email: 'aaa@gmail',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Jane Doe',
    username: 'jane',
    email: 'bbb@gmail',
    password: '123456',
    role: 'user',
  },
  {
    id: 3,
    name: 'Jack Doe',
    username: 'jacky',
    email: 'ccc@gmail',
    password: '123456',
    role: 'editor',
  },
];

@Injectable()
export class UsersService {
    async findOne(email: string): Promise<User | undefined> {
        return users.find(user => user.email === email);
    }
    async findUserByName(name: string): Promise<User | undefined> {
        return users.find(user => user.name === name);
    }
    async findUserByUsername(username: string): Promise<User | undefined> {
        return users.find(user => user.username === username);
    }
    async findUserById(id: number): Promise<User | undefined> {
        return users.find(user => user.id === id);
    }
    async deleteUserById(id: number): Promise<User | undefined> {
        const user = await this.findUserById(id);
        if (user) {
            users.splice(users.indexOf(user), 1);
            return user;
        }
        return undefined;
    }
}
