import { PartialType } from '@nestjs/mapped-types';
import { CreateContentDto } from './create-content.dto';
import { IsMongoId, IsOptional } from 'class-validator';
export class UpdateContentDto extends PartialType(CreateContentDto) {
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;
}
