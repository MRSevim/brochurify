import { PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./db";

const TABLE_NAME = "brochurify";

export async function createOrUpdateUser({
  email,
  username,
  role = "user",
}: {
  email: string;
  username: string;
  role?: string;
}) {
  try {
    const userItem = {
      userId: email,
      id: "profile", // reserved value to distinguish user profiles
      type: "profile",
      username,
      email,
      role,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: userItem,
    });

    await docClient.send(command);
    return userItem;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getUserProfile(email: string) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: email,
        id: "profile",
      },
    });

    const response = await docClient.send(command);
    return response.Item;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function deleteUser(email: string) {
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: email,
        id: "profile",
      },
    });

    await docClient.send(command);
    return true;
  } catch (error: any) {
    throw Error(error);
  }
}
