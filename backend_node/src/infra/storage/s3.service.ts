import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { CustomError } from "../../middlewares/errorHandler.js";
import { UploadResult } from "./storage.types.js";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderPath: string,
): Promise<UploadResult> => {
  try {
    const sanitizedFileName = fileName.replace(/\s+/g, "-");
    const normalizedPath = folderPath.replace(/^\/+|\/+$/g, "");
    const key = `${normalizedPath}/${Date.now()}-${sanitizedFileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
          "original-name": fileName,
          "uploaded-at": new Date().toISOString(),
        },
      }),
    );

    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      fileName,
      bucket: BUCKET_NAME,
      key,
      url,
      mimeType,
      size: fileBuffer.length,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new CustomError(500, "Failed to upload file to S3");
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );
  } catch (error) {
    console.error("S3 delete error:", error);
  }
};