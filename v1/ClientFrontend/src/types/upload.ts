import { BlockType } from "./content";

export interface UploadedFileResponseDto {
  type: BlockType;
  value: string;
  caption?: string;
  metadata?: Record<string, any>;
}
