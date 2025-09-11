import { BlockType } from 'src/schemas/content.schema';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];

  @IsOptional()
  @IsMongoId()
  createdBy: string;
}

export class ContentBlockDto {
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
