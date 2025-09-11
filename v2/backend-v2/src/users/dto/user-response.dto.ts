import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '64f8a8b4c1d2e3f4a5b6c7d8',
  })
  @Transform(({ value }: { value: unknown }) => String(value))
  _id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'client',
    enum: ['admin', 'editor', 'client'],
  })
  role: string;

  @ApiProperty({
    description: 'ID of user who created this user',
    example: '64f8a8b4c1d2e3f4a5b6c7d8',
  })
  createdBy?: string;

  @ApiProperty({
    description: 'ID of user who last updated this user',
    example: '64f8a8b4c1d2e3f4a5b6c7d8',
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  // Exclude password from all responses
  @Exclude()
  password: string;
}
