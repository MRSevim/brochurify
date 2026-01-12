import { parse } from "tldts";
import { checkRole, protect } from "../../features/auth/utils/helpers";
import { StringOrUnd } from "../../utils/Types";
import docClient from "./db";
import { GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Vercel } from "@vercel/sdk";
import { serverEnv } from "@/utils/serverConfig";

export const vercel = new Vercel({
  bearerToken: serverEnv.VERCEL_API_TOKEN,
});

const TABLE_NAME = serverEnv.DB_TABLE_NAME;
const PROJECT_NAME = "brochurify";

export async function requestCustomDomain(id: string, domain: string) {
  const user = await protect();
  checkRole(user, "subscriber");

  // Regex check for valid domain format
  const domainRegex = /^([a-z0-9-]+\.)+[a-z]{2,}$/;
  if (!domainRegex.test(domain.toLowerCase())) {
    throw new Error("Invalid domain format");
  }

  // ✅ Get the current project
  const { Item: existingProject } = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  if (!existingProject) {
    throw new Error("Project not found");
  }

  if (!existingProject.published) {
    throw new Error("Please publish your project first");
  }

  // Look for existing project with this domain
  const existingDomain = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "customDomain-index",
      KeyConditionExpression: "#customDomain = :domain",
      ExpressionAttributeNames: { "#customDomain": "customDomain" },
      ExpressionAttributeValues: { ":domain": domain },
      Limit: 1,
    })
  );

  function isSubdomain(domain: string): boolean {
    const parsed = parse(domain);
    return !!parsed.subdomain;
  }
  const subdomainRecords = [
    {
      domain,
      type: "CNAME",
      value: "cname.vercel-dns.com",
      reason: "CNAME for subdomain",
    },
  ];

  const apexRecords = [
    {
      domain: "@",
      type: "A",
      value: "76.76.21.21",
      reason: "A record for apex domain",
    },
    {
      domain: "www",
      type: "CNAME",
      value: domain,
      reason: "CNAME to redirect www to apex (Optional)",
    },
  ];
  const baseRecords = isSubdomain(domain) ? subdomainRecords : apexRecords;
  if (
    existingDomain.Items?.length &&
    existingDomain.Items[0].id !== id &&
    existingDomain.Items[0].domainVerified
  ) {
    throw new Error("This domain is already in use");
  } else if (
    existingDomain.Items?.length &&
    existingDomain.Items[0].id === id
  ) {
    if (existingDomain.Items[0].domainVerified) {
      throw new Error(
        "Domain you entered is already verified. Please wait a little if you do not see your live site"
      );
    } else {
      const result = await vercel.projects.getProjectDomain({
        idOrName: PROJECT_NAME,
        domain,
      });

      return [...baseRecords, ...(result.verification ?? [])];
    }
  }
  const mainDomainResponse = await vercel.projects.addProjectDomain({
    idOrName: PROJECT_NAME,
    requestBody: {
      name: domain,
    },
  });

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
      UpdateExpression:
        "SET #customDomain = :domain, #domainVerified = :status, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#customDomain": "customDomain",
        "#domainVerified": "domainVerified",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":domain": domain,
        ":status": false,
        ":updatedAt": new Date().toISOString(),
      },
    })
  );
  const verification = mainDomainResponse.verification;

  return [...baseRecords, ...(verification ?? [])];
}

export async function checkVerificationStatus(id: string) {
  const user = await protect();
  checkRole(user, "subscriber");

  const existing = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  // If already verified in DB, skip and return immediately
  if (existing.Item?.domainVerified) {
    return true;
  }

  const domain = existing.Item?.customDomain;
  if (!domain) throw new Error("No custom domain set");

  const verifyResponse = await vercel.projects.verifyProjectDomain({
    idOrName: PROJECT_NAME,
    domain,
  });
  const configResponse = await vercel.domains.getDomainConfig({
    domain,
  });

  // ✅ If all checks pass, update project status in DB
  if (verifyResponse.verified && !configResponse.misconfigured) {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.userId, id },
        UpdateExpression: "SET #domainVerified = :status",
        ExpressionAttributeNames: {
          "#domainVerified": "domainVerified",
        },
        ExpressionAttributeValues: {
          ":status": true,
        },
      })
    );
    return true;
  } else {
    return false;
  }
}

export async function removeCustomDomain(id: string) {
  const user = await protect();

  // Fetch the current item
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  if (!Item) throw new Error("Project not found");
  if (!Item.customDomain)
    throw new Error("You have no custom domain associated with the project");

  removeCustomDomainInner(Item, user);
}

export const removeCustomDomainInner = async (
  Item: Record<string, any>,
  user: Record<string, any>
) => {
  await vercel.projects.removeProjectDomain({
    idOrName: PROJECT_NAME,
    domain: Item.customDomain,
  });

  // Remove domain fields from DB
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id: Item.id },
      UpdateExpression: `
        REMOVE #customDomain, #domainVerified
      `,
      ExpressionAttributeNames: {
        "#customDomain": "customDomain",
        "#domainVerified": "domainVerified",
      },
    })
  );
};
