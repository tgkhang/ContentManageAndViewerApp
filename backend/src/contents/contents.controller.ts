import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { S3Service } from 'src/s3/s3.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlockType } from 'src/schemas/content.schema';
import { AuthGuard } from "../auth/guards/auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"

@Controller('contents')
@UseGuards(AuthGuard, RolesGuard)
export class ContentsController {
  constructor(
    private readonly contentsService: ContentsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @Roles('editor', 'admin')
  create(@Body() createContentDto: CreateContentDto, @Request() req) {
    createContentDto.createdBy = req.user._id;
    return this.contentsService.create(createContentDto);
  }

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  // Move this specific route before the dynamic parameter routes
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
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

  // Move specific routes before the dynamic parameter routes
  @Get('user/:userId')
  async getContentByUser(@Param('userId') userId: string) {
    return this.contentsService.getContentByUser(userId);
  }

  // Dynamic parameter routes should come AFTER specific routes
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Request() req,
  ) {
    updateContentDto.updatedBy = req.user._id; 
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(':id')
  @Roles('editor', 'admin')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }
}