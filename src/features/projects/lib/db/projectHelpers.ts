import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "../../../../lib/db/db";
import { v4 as uuidv4 } from "uuid";
import { checkRole, protect } from "../../../auth/utils/serverHelpers";
import { EditorState } from "@/features/builder/utils/types.d";
import { generateHTML } from "../../../../utils/HTMLGenerator";
import { snapshotQueue } from "../../../../lib/redis";
import { deleteFromS3 } from "../../../../lib/s3/helpers";
import { appConfig } from "../../../../utils/config";
import { removeCustomDomainInner, vercel } from "../customDomainHelpers";
import { serverEnv } from "../../../../utils/serverConfig";
import { stripEditorFields } from "../../utils/helpers";

const TABLE_NAME = serverEnv.DB_TABLE_NAME;

const addJobToQueue = async (
  isTemplate: boolean,
  html: string,
  userId: string,
  id: string,
) => {
  const jobId = `${userId}-${id}`;
  console.log(`🔁 Scheduling snapshot job (${jobId}) to run in 10 minutes...`);

  // 1. Check if job exists
  const existingJob = await snapshotQueue.getJob(jobId);
  if (existingJob) {
    console.log(`🗑 Removing existing job ${jobId} before adding new one.`);
    await existingJob.remove();
  }

  // Add a background job
  await snapshotQueue.add(
    "create-snapshot",
    {
      isTemplate,
      html,
      userId,
      id,
    },
    {
      delay: 10 * 60 * 1000, // 10 minutes
      jobId, // Unique key to overwrite if re-added
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3, // Retry on failure
      backoff: { type: "fixed", delay: 5000 }, // Wait between retries
    },
  );
};

export async function createProject(project: {
  title: string;
  type: string;
  editor: Partial<EditorState>;
  snapshot?: string;
}) {
  const user = await protect();
  const type = project.type;
  const isTemplate = type === "template";
  if (isTemplate) {
    checkRole(user, "admin");
  }
  if (type === "project") {
    const projects = await getAllProjects(type);
    const projectsLength = projects.length;

    const subLimit = appConfig.SUB_ACC_PROJECT_LIMIT;
    const freeLimit = appConfig.FREE_ACC_PROJECT_LIMIT;

    if (projectsLength > subLimit) {
      checkRole(
        user,
        "admin",
        `You cannot create more than ${subLimit} projects!`,
      );
    } else if (projectsLength > freeLimit) {
      checkRole(
        user,
        "subscriber",
        `You cannot create more than ${freeLimit} projects!`,
      );
    }
  }

  const { layout, pageWise, variables } = project.editor;
  if (!layout || !pageWise || !variables) {
    throw Error(
      "Please pass in layout, pageWise and variables to createProject",
    );
  }
  const id = uuidv4();
  const html = generateHTML(layout, pageWise, variables);
  if (type === "template") {
    await addJobToQueue(isTemplate, html, user.userId, id);
  }

  const projectItem = {
    userId: user.userId,
    id,
    type,
    editor: stripEditorFields(project.editor),
    title: project.title,
    createdAt: new Date().toISOString(),
    snapshot: project.snapshot,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: projectItem,
  });

  await docClient.send(command);
  return projectItem;
}

export async function getAllProjects(type: string) {
  const user = await protect();
  if (type === "template") {
    checkRole(user, "admin");
  }
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "#type = :type",
    ExpressionAttributeNames: {
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":userId": user.userId,
      ":type": type,
    },
  });

  const result = await docClient.send(command);
  return result.Items || [];
}

export async function getTemplates() {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "#type = :type",
    ExpressionAttributeNames: {
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":type": "template",
    },
  });

  const result = await docClient.send(command);
  const templates = result.Items || [];

  return templates;
}

export async function scanPrefix(prefix: string) {
  await protect();
  let items: any[] = [];
  let index = 0;

  while (true) {
    const currentPrefix = index === 0 ? prefix : `${prefix}-${index}`;
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "prefix-index",
        KeyConditionExpression: "#prefix = :prefixVal",
        ExpressionAttributeNames: {
          "#prefix": "prefix",
        },
        ExpressionAttributeValues: {
          ":prefixVal": currentPrefix,
        },
        ProjectionExpression: "prefix", // optional
      }),
    );

    if (result.Items && result.Items.length > 0) {
      items.push(...result.Items);
    } else {
      // Stop if no more matching prefixes found
      break;
    }

    index++;
  }

  return items;
}

export async function getProjectById(type: string, id: string) {
  const user = await protect();

  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId: user.userId, id },
  });

  const result = await docClient.send(command);
  if (!result.Item) throw Error("Project not found or unauthorized");

  const project = result.Item;

  if (type === "template" || project.type === "template") {
    checkRole(user, "admin");
  }

  return project;
}

export async function updateProject(
  type: string,
  id: string,
  updates: Partial<{
    title: string;
    editor: EditorState;
    publish: {
      prefix?: string;
      published: boolean;
      editor?: EditorState;
    };
  }>,
) {
  const user = await protect();
  const isTemplate = type === "template";
  if (isTemplate) {
    checkRole(user, "admin");
  }
  // Get the project by ID and ensure it belongs to the user
  const existingProject = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    }),
  );

  if (!existingProject.Item) {
    throw Error("Project not found or unauthorized");
  }

  let setExpressions: string[] = [];
  let removeExpressions: string[] = [];

  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  if (updates.title) {
    setExpressions.push("#title = :title");
    expressionAttributeNames["#title"] = "title";
    expressionAttributeValues[":title"] = updates.title;
  }
  if (updates.editor) {
    const { layout, pageWise, variables } = updates.editor;
    if (!layout || !pageWise || !variables) {
      throw Error(
        "Please pass in layout, pageWise and variables to updateProject",
      );
    }

    await addJobToQueue(
      isTemplate,
      generateHTML(layout, pageWise, variables),
      user.userId,
      id,
    );
    const MAX_PROJECT_SIZE_BYTES = appConfig.MAX_PROJECT_SIZE_KB * 1024;
    const Body = JSON.stringify(stripEditorFields(updates.editor));
    const sizeInBytes = new TextEncoder().encode(Body).length;

    if (sizeInBytes > MAX_PROJECT_SIZE_BYTES) {
      throw new Error(
        `Project data size exceeds the limit of ${appConfig.MAX_PROJECT_SIZE_KB} KB`,
      );
    }
    setExpressions.push("#editor = :editor");
    expressionAttributeNames["#editor"] = "editor";
    expressionAttributeValues[":editor"] = stripEditorFields(updates.editor);
  }
  if (updates.publish) {
    const { prefix, published, editor } = updates.publish;

    if (prefix !== undefined && published) {
      //handle initial publish
      const reserved = ["www", "admin", "app", "send"];
      if (reserved.includes(prefix.toLowerCase())) {
        throw Error(
          `The subdomain "${prefix}" is reserved and cannot be used.`,
        );
      }
      setExpressions.push("#prefix = :prefix");
      expressionAttributeNames["#prefix"] = "prefix";
      expressionAttributeValues[":prefix"] = prefix;
    } else if (prefix === undefined && !published) {
      //handle unpublish
      removeExpressions.push("#prefix, #customDomain, #domainVerified");
      expressionAttributeNames["#prefix"] = "prefix";
      expressionAttributeNames["#customDomain"] = "customDomain";
      expressionAttributeNames["#domainVerified"] = "domainVerified";
      const customDomain = existingProject.Item.customDomain;
      if (customDomain) {
        await vercel.projects.removeProjectDomain({
          idOrName: "brochurify",
          domain: customDomain,
        });
      }
    }

    if (published && editor) {
      setExpressions.push("#editor = :editor");
      expressionAttributeNames["#editor"] = "editor";
      expressionAttributeValues[":editor"] = stripEditorFields(editor);
    }

    setExpressions.push("#published = :published");
    expressionAttributeNames["#published"] = "published";
    expressionAttributeValues[":published"] = published;
  }
  // Add updatedAt field
  setExpressions.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  if (!setExpressions.length && !removeExpressions.length)
    throw Error("No updates provided");

  // Final UpdateExpression assembly
  const updateExpressionParts = [];
  if (setExpressions.length)
    updateExpressionParts.push("SET " + setExpressions.join(", "));
  if (removeExpressions.length)
    updateExpressionParts.push("REMOVE " + removeExpressions.join(", "));

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId: user.userId, id },
    UpdateExpression: updateExpressionParts.join(" "),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const result = await docClient.send(command);
  return result.Attributes;
}

export async function deleteProject(type: string, id: string) {
  const user = await protect();
  const isTemplate = type === "template";
  if (isTemplate) {
    checkRole(user, "admin");
  }

  // Get the project by ID and ensure it belongs to the user
  const existingProject = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    }),
  );

  const Item = existingProject.Item;

  if (!Item) {
    throw Error("Project not found or unauthorized");
  }

  if (Item.customDomain) {
    await removeCustomDomainInner(Item, user);
  }

  //snapshot deletion
  await deleteFromS3(
    isTemplate
      ? `templateSnapshots/${id}.jpeg`
      : `${user.userId}/snapshots/${id}.jpeg`,
  );

  //editor data deletion
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId: user.userId, id },
  });

  await docClient.send(command);
  return true;
}
