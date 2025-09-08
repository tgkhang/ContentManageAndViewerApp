import { User } from "./user";

export enum BlockType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

export interface ContentBlock {
  type: BlockType;
  value: string;
  caption?: string;
  metadata?: Record<string, any>;
}

export interface Content {
  _id: string;
  title: string;
  description?: string;
  blocks: ContentBlock[];
  createdBy: User;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  blocks: ContentBlock[];
  createdBy?: string;
}

export type UpdateContentDto = Partial<Omit<CreateContentDto, "createdBy">> & {
  updatedBy?: string;
};

export interface ContentCardProps {
  content: Content;
}
