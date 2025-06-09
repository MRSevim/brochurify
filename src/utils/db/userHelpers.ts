import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { getUser, protect } from "../serverActions/helpers";
import { StringOrUnd } from "../Types";
import { deleteFolderFromS3 } from "../s3/helpers";

const TABLE_NAME = process.env.DB_TABLE_NAME;

export async function createOrUpdateUser({
  email,
  username,
  image,
  roles = ["user"],
}: {
  email: string;
  username: string;
  image: string;
  roles?: string[];
}) {
  try {
    const getUserCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: email,
        id: "profile",
      },
    });

    const response = await docClient.send(getUserCommand);
    const user = response.Item;
    const userItem = {
      userId: email,
      id: "profile", // reserved value to distinguish user profiles
      type: "profile",
      username,
      image,
      email,
      roles: user?.roles || roles,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: userItem,
    });

    await docClient.send(command);
    return userItem;
  } catch (error: any) {
    throw error;
  }
}

export async function getUserProfile(token: StringOrUnd) {
  try {
    const user = await protect(token);

    return user;
  } catch (error: any) {
    throw error;
  }
}

export async function deleteUser(token: StringOrUnd) {
  try {
    const user = await protect(token);

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

    await deleteFolderFromS3(user.userId);
    await Promise.all(deletePromises);
    return true;
  } catch (error: any) {
    throw error;
  }
}

export async function subscribe(userId: string, subscriptionId: string) {
  try {
    const user = await getUser(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const roles = new Set(user.roles || []);
    roles.add("subscriber");

    const updatedUser = {
      ...user,
      roles: Array.from(roles),
      subscriptionId,
    };

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedUser,
    });

    await docClient.send(putCommand);
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
}

export async function unsubscribe(subscriptionId: string) {
  try {
    // Scan the table to find the user with matching subscriptionId
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "subscriptionId = :subscriptionId",
      ExpressionAttributeValues: {
        ":subscriptionId": subscriptionId,
      },
      Limit: 1,
    });

    const result = await docClient.send(scanCommand);

    if (!result.Items || result.Items.length === 0) {
      throw new Error("User with subscriptionId not found");
    }

    const user = result.Items[0];

    const roles = new Set(user.roles || []);
    roles.delete("subscriber");

    // Remove subscriptionId field
    const { subscriptionId: _, ...rest } = user;

    const updatedUser = {
      ...rest,
      roles: Array.from(roles),
    };

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedUser,
    });

    await docClient.send(putCommand);
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
}
