import z from "zod";

export interface UploadResult {
  fileName: string;
  bucket: string;
  key: string;
  url: string,
  mimeType: string;
  size: number;
}

export const uploadedFileSchema = z.object({
  originalname: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});

export type MulterType = Express.Multer.File;