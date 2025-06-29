import {
  ACMClient,
  DeleteCertificateCommand,
  DescribeCertificateCommand,
  RequestCertificateCommand,
} from "@aws-sdk/client-acm";
import { checkRole, protect } from "../serverActions/helpers";
import { StringOrUnd } from "../Types";
import docClient from "./db";
import { GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { appConfig } from "../config";

const acm = new ACMClient({ region: "us-east-1" }); // must be us-east-1 for CloudFront

const TABLE_NAME = process.env.DB_TABLE_NAME;

export async function requestCustomDomainCertificate(
  id: string,
  domain: string,
  token: StringOrUnd
) {
  const user = await protect(token);
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

  if (existingProject.published !== 1) {
    throw new Error("Please publish your project first");
  }
  // ✅ If domain is already set by the same user/project, return early
  if (
    existingProject.customDomain === domain &&
    existingProject.certificateArn
  ) {
    return existingProject.certificateArn;
  } else if (existingProject.certificateArn) {
    await acm.send(
      new DeleteCertificateCommand({
        CertificateArn: existingProject.certificateArn,
      })
    );
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

  if (existingDomain.Items?.length && existingDomain.Items[0].id !== id) {
    throw new Error("This domain is already in use");
  }
  const command = new RequestCertificateCommand({
    DomainName: domain,
    ValidationMethod: "DNS",
    IdempotencyToken: domain.replace(/\W/g, "").slice(0, 32),
  });

  const result = await acm.send(command);

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
      UpdateExpression:
        "SET #customDomain = :domain, #certificateArn = :cert, #verificationStatus = :status, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#customDomain": "customDomain",
        "#certificateArn": "certificateArn",
        "#verificationStatus": "verificationStatus",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":domain": domain,
        ":cert": result.CertificateArn,
        ":status": appConfig.PENDING,
        ":updatedAt": new Date().toISOString(),
      },
    })
  );

  return result.CertificateArn;
}

export async function getCertificateValidationRecord(
  id: string,
  token: StringOrUnd
) {
  const user = await protect(token);
  checkRole(user, "subscriber");
  const existing = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  const certArn = existing.Item?.certificateArn;
  const domain = existing.Item?.customDomain;

  if (!certArn) throw new Error("No certificate ARN found on this project");
  if (!domain) throw new Error("No custom domain found on this project");
  if (existing.Item?.published !== 1) {
    throw new Error("Please publish your project first");
  }

  async function waitForValidationRecord(certArn: string, maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const { Certificate } = await acm.send(
        new DescribeCertificateCommand({ CertificateArn: certArn })
      );
      const option = Certificate?.DomainValidationOptions?.[0];
      if (option?.ResourceRecord) return option.ResourceRecord;

      await new Promise((res) =>
        setTimeout(res, Math.min(1000 * (attempt + 1), 5000))
      ); // Exponential backoff
    }
    throw new Error("No validation record found after waiting");
  }
  const record = await waitForValidationRecord(certArn);

  return [
    {
      name: record.Name as string,
      type: record.Type + " or ALIAS/ANAME (for root domains)",
      value: record.Value as string,
      usage: "SSL Verification (ACM)",
    },
    {
      name: domain,
      type: "CNAME or ALIAS/ANAME (for root domains)",
      value: appConfig.AWS_CLOUDFRONT_URL,
      usage: "Domain Routing (CloudFront)",
    },
  ];
}
export async function checkCertificateStatus(id: string, token: StringOrUnd) {
  const user = await protect(token);
  checkRole(user, "subscriber");

  const existing = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  const certArn = existing.Item?.certificateArn;
  if (!certArn) {
    throw new Error("No certificate ARN found for this project.");
  }
  const currentCertStatusInDb = existing.Item?.verificationStatus;

  const verified = appConfig.VERIFIED;

  // If already VERIFIED in DB, skip and return immediately
  if (currentCertStatusInDb === verified) {
    return verified;
  }
  const { Certificate } = await acm.send(
    new DescribeCertificateCommand({ CertificateArn: certArn })
  );
  const status = Certificate?.Status;
  if (!status) {
    throw new Error("Unable to retrieve certificate status.");
  }
  const domain = existing.Item?.customDomain;
  if (!domain) throw new Error("No custom domain set");

  // ✅ If all checks pass, update project status in DB
  if (status === "ISSUED") {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.userId, id },
        UpdateExpression: "SET #verificationStatus = :status",
        ExpressionAttributeNames: {
          "#verificationStatus": "verificationStatus",
        },
        ExpressionAttributeValues: {
          ":status": verified,
        },
      })
    );
    return verified;
  } else {
    return status;
  }
}

export async function removeCustomDomain(id: string, token: StringOrUnd) {
  const user = await protect(token);

  // Fetch the current item
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    })
  );

  if (!Item) throw new Error("Project not found");

  const certArn = Item.certificateArn;

  // Attempt to delete ACM certificate if exists
  if (certArn) {
    try {
      await acm.send(new DeleteCertificateCommand({ CertificateArn: certArn }));
    } catch (err) {
      console.error("Failed to delete ACM certificate:", err);
      // Optional: allow soft failure to still clean up DB
    }
  }

  // Remove domain fields from DB
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
      UpdateExpression: `
        REMOVE #customDomain, #certificateArn, #verificationStatus
      `,
      ExpressionAttributeNames: {
        "#customDomain": "customDomain",
        "#certificateArn": "certificateArn",
        "#verificationStatus": "verificationStatus",
      },
    })
  );
}
