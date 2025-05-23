import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMODB_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(dbClient);

export default docClient;
