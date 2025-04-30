import { Injectable, ConflictException } from "@nestjs/common"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

export type User = {
  id: number
  name: string
  username: string
  email: string
  password: string
  role: string
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    username: "johnny",
    email: "aaa@gmail",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    name: "Jane Doe",
    username: "jane",
    email: "bbb@gmail",
    password: "123456",
    role: "editor",
  },
  {
    id: 3,
    name: "Jack Doe",
    username: "jacky",
    email: "ccc@gmail",
    password: "123456",
    role: "client",
  },
]

@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User | undefined> {
    return users.find((user) => user.email === email)
  }

  async findUserByName(name: string): Promise<User | undefined> {
    return users.find((user) => user.name === name)
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return users.find((user) => user.username === username)
  }

  async findUserById(id: number): Promise<User | undefined> {
    return users.find((user) => user.id === id)
  }

  async deleteUserById(id: number): Promise<User | undefined> {
    const user = await this.findUserById(id)
    if (user) {
      users.splice(users.indexOf(user), 1)
      return user
    }
    return undefined
  }

  async findAll(): Promise<User[]> {
    return users.map((user) => {
      const { password, ...result } = user
      return result as User
    })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email or username already exists
    const existingEmail = await this.findOne(createUserDto.email)
    if (existingEmail) {
      throw new ConflictException("Email already exists")
    }

    const existingUsername = await this.findUserByUsername(createUserDto.username)
    if (existingUsername) {
      throw new ConflictException("Username already exists")
    }

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      ...createUserDto,
    }

    users.push(newUser)

    // Return user without password
    const { password, ...result } = newUser
    return result as User
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | undefined> {
    const user = await this.findUserById(id)
    if (!user) {
      return undefined
    }

    // Check if email is being updated and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.findOne(updateUserDto.email)
      if (existingEmail) {
        throw new ConflictException("Email already exists")
      }
    }

    // Check if username is being updated and already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.findUserByUsername(updateUserDto.username)
      if (existingUsername) {
        throw new ConflictException("Username already exists")
      }
    }

    // Update user
    Object.assign(user, updateUserDto)

    // Return user without password
    const { password, ...result } = user
    return result as User
  }
}

