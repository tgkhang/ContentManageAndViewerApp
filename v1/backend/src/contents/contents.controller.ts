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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlockType } from 'src/schemas/content.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('contents')
@UseGuards(AuthGuard, RolesGuard)
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @Roles('editor', 'admin')
  create(@Body() createContentDto: CreateContentDto, @Request() req) {
    createContentDto.createdBy = req.user.userId
    return this.contentsService.create(createContentDto);
  }

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get('user/:userId')
  async getContentByUser(@Param('userId') userId: string) {
    return this.contentsService.getContentByUser(userId);
  }

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
    updateContentDto.updatedBy = req.user.userId
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(':id')
  @Roles('editor', 'admin')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }
}
