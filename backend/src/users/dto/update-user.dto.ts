import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    name?: string
  
    @IsOptional()
    @IsString()
    username?: string
  
    @IsOptional()
    @IsEmail()
    email?: string
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string
  
    @IsOptional()
    @IsString()
    role?: string
}
