import { S3Client } from "@aws-sdk/client-s3";

const isLocal = process.env.ENV === "development";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: isLocal ? process.env.AWS_S3_URL : undefined,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default s3Client;
