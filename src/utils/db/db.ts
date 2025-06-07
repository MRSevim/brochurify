import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.ENV === "development";

export const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: isLocal ? process.env.AWS_DYNAMODB_URL : undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(dbClient);

export default docClient;
