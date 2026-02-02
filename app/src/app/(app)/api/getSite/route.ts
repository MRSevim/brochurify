import docClient from "@/lib/db/db";
import { appConfig } from "@/utils/config";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Missing domain parameter." },
        { status: 400 }
      );
    }

    const site = await getSite(domain);

    return NextResponse.json(site, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

const getSite = async (domain: string) => {
  try {
    console.log("getting tenant site from domain: ", domain);
    if (domain.endsWith(appConfig.DOMAIN_EXTENSION)) {
      const prefix = domain.split(".")[0].toLowerCase();
      console.log("🔍 Detected subdomain prefix:", prefix);

      if (!prefix || RESERVED_PREFIXES.includes(prefix)) {
        console.log("🚫 Reserved or empty prefix:", prefix);
        return;
      }

      const project = await getProjectByPrefix(prefix);

      if (!project || !project.published) {
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
        console.log("🚫 Site cannot be server at the time.");
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
