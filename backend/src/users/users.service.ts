import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    // Check if the user already exists
    const existingEmail = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    const existingUsername = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    //const newUser = new this.userModel(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      // Log database errors for debugging
      console.error('Database error in findByEmail:', error);
      throw new Error('Database operation failed');
    }
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
