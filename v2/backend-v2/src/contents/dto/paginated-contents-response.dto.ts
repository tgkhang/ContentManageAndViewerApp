import { ApiProperty } from '@nestjs/swagger';
import { ContentDocument } from 'src/schemas/content.schema';

export class PaginatedContentsResponseDto {
  @ApiProperty({
    description: 'Array of content items',
    type: [Object],
  })
  data: ContentDocument[];

  @ApiProperty({
    description: 'Total number of content items',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
