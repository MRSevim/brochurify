import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { v4 as uuidv4 } from "uuid";
import { checkAdmin, protect } from "../serverActions/helpers";
import { EditorState, StringOrUnd } from "../Types";
import { stripEditorFields } from "../Helpers";
import { generateHTML } from "../HTMLGenerator";
/* import { snapshotQueue } from "../lib/workers"; */
import { deleteFromS3 } from "../s3/helpers";

const TABLE_NAME = process.env.DB_TABLE_NAME;

export const makeSnapshotUrl = (id: string) => `snapshots/${id}.png`;

export async function createProject(
  project: {
    title: string;
    type: string;
    editor: Partial<EditorState>;
    snapshot?: string;
  },
  token: StringOrUnd
) {
  try {
    const user = await protect(token);
    const type = project.type;
    if (type === "template") {
      await checkAdmin(user);
    }

    const { layout, pageWise, variables } = project.editor;
    if (!layout || !pageWise || !variables) {
      throw Error(
        "Please pass in layout, pageWise and variables to createProject"
      );
    }
    const id = uuidv4();
    const html = generateHTML(layout, pageWise, variables, false);
    if (type === "template") {
      // Add a background job
      /*       await snapshotQueue.add("create-snapshot", {
        html,
        userId: user.userId,
        id,
      }); */
    }

    const projectItem = {
      userId: user.userId,
      id,
      type,
      title: project.title,
      data: project.editor,
      createdAt: new Date().toISOString(),
      snapshot: project.snapshot,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: projectItem,
    });

    await docClient.send(command);
    return projectItem;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getAllProjects(type: string, token: StringOrUnd) {
  try {
    const user = await protect(token);
    if (type === "template") {
      await checkAdmin(user);
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
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getTemplates() {
  try {
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
    return result.Items || [];
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getProjectById(
  type: string,
  token: StringOrUnd,
  id: string
) {
  try {
    const user = await protect(token);

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    });

    const result = await docClient.send(command);
    if (!result.Item) throw Error("Project not found or unauthorized");

    const project = result.Item;

    if (type === "template" || project.type === "template") {
      await checkAdmin(user);
    }
    return project;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function updateProject(
  type: string,
  token: StringOrUnd,
  id: string,
  updates: Partial<{ title: string; editor: EditorState }>
) {
  try {
    const user = await protect(token);
    if (type === "template") {
      await checkAdmin(user);
    }
    // ✅ 1. Get the project by ID and ensure it belongs to the user
    const existingProject = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.userId, id },
      })
    );

    if (!existingProject.Item) {
      throw Error("Project not found or unauthorized");
    }

    const updateExpressions = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (updates.title) {
      updateExpressions.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = updates.title;
    }
    if (updates.editor) {
      const { layout, pageWise, variables } = updates.editor;
      if (!layout || !pageWise || !variables) {
        throw Error(
          "Please pass in layout, pageWise and variables to createProject"
        );
      }
      // Add a background job
      /*      await snapshotQueue.add("create-snapshot", {
        html: generateHTML(layout, pageWise, variables, false),
        userId: user.userId,
        id,
      }); */
      updateExpressions.push("#data = :data");
      expressionAttributeNames["#data"] = "data";
      expressionAttributeValues[":data"] = stripEditorFields(updates.editor);
    }
    // Add updatedAt field
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    if (!updateExpressions.length) throw Error("No updates provided");

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function deleteProject(
  type: string,
  token: StringOrUnd,
  id: string
) {
  try {
    const user = await protect(token);
    if (type === "template") {
      await checkAdmin(user);
    }

    // ✅ 1. Get the project by ID and ensure it belongs to the user
    const existingProject = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.userId, id },
      })
    );

    if (!existingProject.Item) {
      throw Error("Project not found or unauthorized");
    }

    await deleteFromS3(makeSnapshotUrl(id));
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    });

    await docClient.send(command);
    return true;
  } catch (error: any) {
    throw Error(error);
  }
}
