import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3Client from "./s3Client";
import { env } from "../config";

const Bucket = env.S3_BUCKET_NAME;

export const uploadToS3 = async ({
  buffer,
  key,
  contentType,
}: {
  buffer: Uint8Array<ArrayBufferLike>;
  key: string;
  contentType: string;
}) => {
  try {
    const command = new PutObjectCommand({
      Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return `${env.AWS_CLOUDFRONT_URL}/${key}`;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteFolderFromS3 = async (prefix: string) => {
  try {
    // List all objects under the prefix
    const listedObjects = await s3Client.send(
      new ListObjectsCommand({
        Bucket,
        Prefix: prefix,
      })
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.warn("No objects found under prefix:", prefix);
      return;
    }

    // Prepare delete params for multiple objects
    const deleteParams = {
      Bucket,
      Delete: {
        Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key! })),
      },
    };

    // Delete all listed objects
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
  } catch (error: any) {
    console.error("Failed to delete files from S3:", error);
    throw new Error(error);
  }
};
