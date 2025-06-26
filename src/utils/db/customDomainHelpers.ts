import {
  ACMClient,
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
        "SET #customDomain = :domain, #certificateArn = :cert, #certificateStatus = :status, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#customDomain": "customDomain",
        "#certificateArn": "certificateArn",
        "#certificateStatus": "certificateStatus",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":domain": domain,
        ":cert": result.CertificateArn,
        ":status": "PENDING_VALIDATION",
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

  const { Certificate } = await acm.send(
    new DescribeCertificateCommand({
      CertificateArn: certArn,
    })
  );

  const option = Certificate?.DomainValidationOptions?.[0];

  if (!option?.ResourceRecord) throw new Error("No validation record found");

  return [
    {
      name: option.ResourceRecord.Name as string,
      type: option.ResourceRecord.Type as string,
      value: option.ResourceRecord.Value as string,
      usage: "SSL Verification (ACM)",
    },
    {
      name: domain,
      type: "CNAME",
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
  const currentCertStatusInDb = existing.Item?.certificateStatus;

  // If already ISSUED in DB, skip ACM call and return immediately
  if (currentCertStatusInDb === "ISSUED") {
    return "ISSUED";
  }
  const { Certificate } = await acm.send(
    new DescribeCertificateCommand({ CertificateArn: certArn })
  );
  const status = Certificate?.Status;
  if (!status) {
    throw new Error("Unable to retrieve certificate status.");
  }
  // ✅ If ISSUED, update project status in DB
  if (status === "ISSUED") {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.userId, id },
        UpdateExpression: "SET #certificateStatus = :status",
        ExpressionAttributeNames: {
          "#certificateStatus": "certificateStatus",
        },
        ExpressionAttributeValues: {
          ":status": "ISSUED",
        },
      })
    );
  }

  return status;
}
