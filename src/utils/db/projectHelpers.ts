import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { v4 as uuidv4 } from "uuid";
import { getScreenSnapshot, protect } from "../serverActions/helpers";
import { EditorState, StringOrUnd } from "../Types";
import { stripEditorFields } from "../Helpers";
import { generateHTML } from "../HTMLGenerator";

const TABLE_NAME = process.env.DB_TABLE_NAME;

export async function createProject(
  project: {
    title: string;
    editor: Partial<EditorState>;
  },
  token: StringOrUnd
) {
  try {
    const user = await protect(token);

    const { layout, pageWise, variables } = project.editor;
    if (!layout || !pageWise || !variables) {
      throw Error(
        "Please pass in layout, pageWise and variables to createProject"
      );
    }
    const buffer = await getScreenSnapshot(
      generateHTML(layout, pageWise, variables, false)
    );
    console.log(buffer);
    const projectItem = {
      userId: user.userId,
      id: uuidv4(),
      type: "project",
      title: project.title,
      data: project.editor,
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

export async function getAllProjects(token: StringOrUnd) {
  try {
    const user = await protect(token);

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":userId": user.userId,
        ":type": "project",
      },
    });

    const result = await docClient.send(command);
    return result.Items || [];
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getProjectById(token: StringOrUnd, id: string) {
  try {
    const user = await protect(token);

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId: user.userId, id },
    });

    const result = await docClient.send(command);
    if (!result.Item || result.Item.type !== "project")
      throw new Error("Project not found or unauthorized");
    return result.Item;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function updateProject(
  token: StringOrUnd,
  id: string,
  updates: Partial<{ title: string; editor: EditorState }>
) {
  try {
    const user = await protect(token);

    const updateExpressions = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (updates.title) {
      updateExpressions.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = updates.title;
    }
    if (updates.editor) {
      updateExpressions.push("#data = :data");
      expressionAttributeNames["#data"] = "data";
      expressionAttributeValues[":data"] = stripEditorFields(updates.editor);
    }

    if (!updateExpressions.length) throw new Error("No updates provided");

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

export async function deleteProject(token: StringOrUnd, id: string) {
  try {
    const user = await protect(token);

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
