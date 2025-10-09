import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if the user already exists
      const existingEmail = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
        
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      const existingUsername = await this.userModel
        .findOne({ username: createUserDto.username })
        .exec();

      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      //transforms a plain JavaScript object into an instance of a class 
      //using the class-transformer library.
      return plainToInstance(UserResponseDto, savedUser.toObject(), {
        excludeExtraneousValues: false,
      });

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;

      // Build search query
      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { username: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        this.userModel
          .find(searchQuery)
          .select('-password') // Exclude password from results
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean() // Convert Mongoose documents to plain JavaScript objects
          .exec(),
        this.userModel.countDocuments(searchQuery).exec(),
      ]);

      // Transform users to UserResponseDto (converts _id to id)
      const transformedUsers = users.map(user =>
        plainToInstance(UserResponseDto, user, {
          // Keep properties not in DTO
          excludeExtraneousValues: false,
        })
      );

      return {
        data: transformedUsers,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.userModel
        .findById(id)
        .select('-password') // Exclude password from result
        .lean()
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Transform to UserResponseDto (converts _id to id)
      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: false,
      });

    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid user ID format');
      }

      // Check if user exists
      const existingUser = await this.userModel.findById(id).exec();
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // If updating email or username, check for conflicts
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const emailExists = await this.userModel
          .findOne({ email: updateUserDto.email, _id: { $ne: id } })
          .exec();
        if (emailExists) {
          throw new ConflictException('Email already exists');
        }
      }

      if (
        updateUserDto.username &&
        updateUserDto.username !== existingUser.username
      ) {
        const usernameExists = await this.userModel
          .findOne({ username: updateUserDto.username, _id: { $ne: id } })
          .exec();
        if (usernameExists) {
          throw new ConflictException('Username already exists');
        }
      }

      // Hash password if it's being updated
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password')
        .lean()
        .exec();

      // Transform to UserResponseDto (converts _id to id)
      return plainToInstance(UserResponseDto, updatedUser, {
        excludeExtraneousValues: false,
      });
      
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Return success message instead of user data
      return { message: 'User successfully deleted', deletedUserId: id };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async findByEmail(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      // This method is used for authentication, so include password
      const user = await this.userModel
        .findOne({ email })
        .select('+password')
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;

    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async findByUsername(username: string) {
    try {
      if (!username) {
        throw new BadRequestException('Username is required');
      }

      // This method is used for authentication, so include password
      const user = await this.userModel
        .findOne({ username })
        .select('+password')
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;

    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by username');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { currentPassword, newPassword } = changePasswordDto;

      // Find user with password field included
      const user = await this.userModel
        .findById(userId)
        .select('+password')
        .exec();
      if (!user || !user.password) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Check if new password is different from current
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new BadRequestException(
          'New password must be different from current password',
        );
      }

      // Hash and update new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await this.userModel
        .findByIdAndUpdate(userId, { password: hashedNewPassword })
        .exec();

      return { message: 'Password changed successfully' };
    } catch (error) {      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }
}
