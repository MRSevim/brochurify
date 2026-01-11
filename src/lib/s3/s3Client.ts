import { S3Client } from "@aws-sdk/client-s3";
import { serverEnv } from "@/utils/serverConfig";

const isDev = serverEnv.ENV === "development";

const s3Client = new S3Client({
  region: serverEnv.AWS_REGION,
  endpoint: isDev ? "http://localhost:9000" : undefined,
  forcePathStyle: isDev,
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
