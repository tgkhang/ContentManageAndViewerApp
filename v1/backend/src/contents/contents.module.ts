import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from 'src/schemas/content.schema';
import { UploadsModule } from 'src/uploads/uploads.module';
import { ContentsGateway } from './contents.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    UploadsModule,
  ],
  controllers: [ContentsController],
  providers: [ContentsService, ContentsGateway],
  exports: [ContentsService],
})
export class ContentsModule {}