import type { User } from "./user";

export const BlockType = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
} as const;

export type BlockType = typeof BlockType[keyof typeof BlockType];

export interface ContentBlock {
  type: BlockType;
  value: string;
  caption?: string;
  metadata?: Record<string, any>;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  blocks: ContentBlock[];
}

export type UpdateContentDto = Partial<CreateContentDto>;

export interface Content {
  id: string;
  title: string;
  description?: string;
  blocks: ContentBlock[];
  createdBy: User;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedContentsResponse {
  data: Content[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContentCardProps {
  content: Content;
}

export type Block = ContentBlock;
