import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Content,
  ContentDocument,
  BlockType,
} from 'src/schemas/content.schema';
import { Model } from 'mongoose';
import { UploadsService } from 'src/uploads/uploads.service';
import { ContentsGateway } from './contents.gateway';

@Injectable()
export class ContentsService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
    private readonly uploadsService: UploadsService,
    private readonly contentsGateway: ContentsGateway,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<ContentDocument> {
    const newContent = await this.contentModel.create(createContentDto);
    const populatedContent = await this.findOne(newContent._id.toString());
    this.contentsGateway.sendContentUpdate(populatedContent);
    return populatedContent;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;

      // Build search query
      const searchQuery = search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const [contents, total] = await Promise.all([
        this.contentModel
          .find(searchQuery)
          .populate('createdBy', 'name username')
          .populate('updatedBy', 'name username')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.contentModel.countDocuments(searchQuery).exec(),
      ]);

      return {
        data: contents,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error('Failed to fetch contents');
    }
  }

  async findOne(id: string): Promise<ContentDocument> {
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
  ): Promise<ContentDocument> {
    const updatedContent = await this.contentModel
      .findByIdAndUpdate(id, updateContentDto, { new: true })
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();

    if (!updatedContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    this.contentsGateway.sendContentUpdate(updatedContent);
    return updatedContent;
  }

  async remove(id: string): Promise<ContentDocument> {
    const content = await this.findOne(id);

    // Delete associated S3 files
    for (const block of content.blocks) {
      if (block.type === BlockType.IMAGE || block.type === BlockType.VIDEO) {
        try {
          await this.uploadsService.deleteFile(block.value);
        } catch (error) {
          console.error(`Failed to delete file ${block.value} from S3:`, error);
        }
      }
    }

    const deletedContent = await this.contentModel.findByIdAndDelete(id).exec();

    if (!deletedContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    this.contentsGateway.sendContentDeleted(id);
    return deletedContent;
  }

  async getContentByUser(userId: string): Promise<ContentDocument[]> {
    return this.contentModel
      .find({ createdBy: userId })
      .populate('createdBy', 'name username')
      .populate('updatedBy', 'name username')
      .exec();
  }
}
