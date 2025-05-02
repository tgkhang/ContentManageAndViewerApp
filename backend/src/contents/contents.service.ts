import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Content } from 'src/schemas/content.schema';
import { Model } from 'mongoose';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ContentsService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(createContentDto);
    return newContent.save();
  }

  async findAll(): Promise<Content[]> {
    return this.contentModel
      .find()
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentModel
      .findById(id)
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const updatedContent = await this.contentModel
      .findByIdAndUpdate(id, updateContentDto, { new: true })
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();

    if (!updatedContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return updatedContent;
  }

  async remove(id: string): Promise<Content> {
    const deletedContent = await this.contentModel.findByIdAndDelete(id).exec();

    if (!deletedContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Delete associated S3 files
    for (const block of deletedContent.blocks) {
      if (block.type === 'image' || block.type === 'video') {
        try {
          await this.s3Service.deleteFile(block.value);
        } catch (error) {
          console.error(`Failed to delete file ${block.value} from S3:`, error);
        }
      }
    }

    return deletedContent;
  }

  async getContentByUser(userId: string): Promise<Content[]> {
    return this.contentModel
      .find({ createdBy: userId })
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();
  }
}
