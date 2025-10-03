import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { BlockType } from '../schemas/content.schema';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File) {
    // Determine file type (image or video)
    const fileType = file.mimetype.startsWith('image/')
      ? BlockType.IMAGE
      : file.mimetype.startsWith('video/')
        ? BlockType.VIDEO
        : null;

    if (!fileType) {
      throw new Error('Unsupported file type');
    }

    // Upload to S3
    const uploadResult = await this.s3Service.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    // Return the block data that can be added to content
    return {
      type: fileType,
      value: uploadResult.key, // S3 key
      metadata: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: uploadResult.url,
      },
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Service.deleteFile(key);
  }
}
