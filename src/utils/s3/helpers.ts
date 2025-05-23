import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

const Bucket = process.env.S3_BUCKET_NAME;

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

    return `${process.env.AWS_S3_URL}/${Bucket}/${key}`;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteFromS3 = async ({ key }: { key: string }) => {
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
