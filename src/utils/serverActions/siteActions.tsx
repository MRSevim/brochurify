import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../db/db";

export const getSite = async (domain: string) => {
  try {
    console.log("domain: ", domain);
    if (domain.endsWith(".brochurify.app")) {
      const prefix = domain.split(".")[0].toLowerCase();
      console.log("🔍 Detected subdomain prefix:", prefix);

      if (!prefix || RESERVED_PREFIXES.includes(prefix)) {
        console.log("🚫 Reserved or empty prefix:", prefix);
        return;
      }

      const project = await getProjectByPrefix(prefix);

      if (!project || project.published) {
        console.log("🚫 No published project found for prefix:", prefix);
        return;
      }

      return project;
    } else {
      console.log("🌐 Custom domain request:", domain);
      const project = await getProjectByCustomDomain(domain);

      if (
        !project ||
        !project.published ||
        !project.customDomain ||
        !project.domainVerified
      ) {
        console.log("🚫 No valid project found for domain:", domain);
        return;
      }

      const user = await getUser(project.userId);
      console.log("👤 User reached:", user?.username);

      if (!user?.roles?.includes("subscriber")) {
        console.log("🚫 User does not have 'subscriber' role.");
        return;
      }
      return project;
    }
  } catch (error: any) {
    return;
  }
};

const TABLE_NAME = "brochurify";

const RESERVED_PREFIXES = ["www", "admin", "app"];

async function getProjectByPrefix(prefix: string) {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "prefix-index",
    KeyConditionExpression: "#prefix = :prefix",
    ExpressionAttributeNames: { "#prefix": "prefix" },
    ExpressionAttributeValues: { ":prefix": prefix },
    Limit: 1,
  };
  console.log("🔍 Querying prefix-index for:", prefix);
  const result = await docClient.send(new QueryCommand(params));
  return result.Items?.[0];
}

async function getProjectByCustomDomain(domain: string) {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "customDomain-index",
    KeyConditionExpression: "#customDomain = :domain",
    ExpressionAttributeNames: { "#customDomain": "customDomain" },
    ExpressionAttributeValues: { ":domain": domain },
    Limit: 1,
  };
  console.log("🔍 Querying customDomain-index for:", domain);
  const result = await docClient.send(new QueryCommand(params));
  return result.Items?.[0];
}

async function getUser(userId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId, id: "profile" },
  };
  console.log("👤 Fetching user profile for:", userId);
  const result = await docClient.send(new GetCommand(params));
  return result.Item;
}
