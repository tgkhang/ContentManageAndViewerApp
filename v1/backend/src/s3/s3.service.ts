import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<{ key: string; url: string }> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucketName) {
      throw new Error(
        'AWS_S3_BUCKET_NAME is not defined in the environment variables',
      );
    }
    // Generate a unique filename to prevent collisions
    const fileExtension = filename.split('.').pop();
    const key = `uploads/${uuid()}.${fileExtension}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: bucketName,
        Body: fileBuffer,
        Key: key,
        ContentType: mimetype,
        ACL: 'public-read', // Make the file publicly accessible
      })
      .promise();

    return {
      key,
      url: uploadResult.Location,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucketName) {
      throw new Error(
        'AWS_S3_BUCKET_NAME is not defined in the environment variables',
      );
    }
    await this.s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();
  }

  getFileUrl(key: string): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');

    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}
