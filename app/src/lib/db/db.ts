import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { serverEnv } from "../../utils/serverConfig";

const isDev = serverEnv.ENV === "development";

const dbClient =
  globalThis.dynamodbClient ??
  new DynamoDBClient({
    region: serverEnv.AWS_REGION,
    endpoint: isDev ? "http://localhost:8000" : undefined,
    credentials: {
      accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
      secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
    },
  });

const docClient =
  globalThis.dynamodbDocClient ?? DynamoDBDocumentClient.from(dbClient);

export default docClient;

if (serverEnv.ENV !== "production") {
  globalThis.dynamodbClient = dbClient;
  globalThis.dynamodbDocClient = docClient;
}
