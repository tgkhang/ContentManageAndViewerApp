import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BlockType } from '../../schemas/content.schema';

export class UploadedFileResponseDto {
  @IsNotEmpty()
  @IsEnum(BlockType)
  type: BlockType;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
