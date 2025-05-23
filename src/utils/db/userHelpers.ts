import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { protect } from "../serverActions/helpers";
import { StringOrUnd } from "../Types";

const TABLE_NAME = process.env.DB_TABLE_NAME;

export async function createOrUpdateUser({
  email,
  username,
  image,
  role = "user",
}: {
  email: string;
  username: string;
  image: string;
  role?: string;
}) {
  try {
    const userItem = {
      userId: email,
      id: "profile", // reserved value to distinguish user profiles
      type: "profile",
      username,
      image,
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

export async function deleteUser(token: StringOrUnd) {
  const user = await protect(token);
  try {
    // Step 1: Query all items with the userId
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": user.userId,
      },
    });

    const result = await docClient.send(queryCommand);

    // Safety check: ensure items exist
    if (!result.Items || result.Items.length === 0) {
      return true;
    }

    // Step 2: Loop through items and delete each one
    const deletePromises = result.Items.map((item) => {
      return docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            userId: item.userId,
            id: item.id,
          },
        })
      );
    });

    await Promise.all(deletePromises);
    return true;
  } catch (error: any) {
    throw Error(error);
  }
}
