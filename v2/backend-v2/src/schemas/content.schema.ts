import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import type { User } from './user.schema';

export type ContentDocument = HydratedDocument<Content>;

export enum BlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class ContentBlock {
  @Prop({ required: true, enum: BlockType })
  type: BlockType;

  @Prop({ required: true })
  value: string;

  @Prop()
  caption?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>;
}

const ContentBlockSchema = new MongooseSchema(
  {
    type: { type: String, required: true, enum: Object.values(BlockType) },
    value: { type: String, required: true },
    caption: { type: String },
    metadata: { type: MongooseSchema.Types.Mixed },
  },
  { _id: true, timestamps: false },
);

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [ContentBlockSchema], default: [] })
  blocks: ContentBlock[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
