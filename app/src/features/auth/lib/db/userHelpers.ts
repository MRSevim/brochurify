import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import docClient from "../../../../lib/db/db";
import { getUser, protect } from "../../utils/serverHelpers";
import { deleteFolderFromS3 } from "../../../../lib/s3/helpers";
import { removeCustomDomainInner } from "../../../projects/lib/customDomainHelpers";
import { serverEnv } from "@/utils/serverConfig";

const TABLE_NAME = serverEnv.DB_TABLE_NAME;

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
    paddleCustomerId: user?.paddleCustomerId,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: userItem,
  });

  await docClient.send(command);
  return userItem;
}

export async function deleteUser() {
  const user = await protect();

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

  const items = result.Items;

  // Step 2: Remove custom domains if present
  const removeDomainPromises = items
    .filter((item) => item.customDomain)
    .map((item) => removeCustomDomainInner(item, user));

  await Promise.all(removeDomainPromises);

  // Step 3: Loop through items and delete each one
  const deletePromises = items.map((item) => {
    return docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          userId: item.userId,
          id: item.id,
        },
      }),
    );
  });

  await deleteFolderFromS3(user.userId);
  await Promise.all(deletePromises);
  return true;
}

export async function getUserProfile() {
  const user = await protect();

  return user;
}

export async function subscribe(userId: string, paddleCustomerId: string) {
  const user = await getUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const roles = new Set(user.roles || []);
  roles.add("subscriber");

  const updatedUser = {
    ...user,
    roles: Array.from(roles),
    paddleCustomerId,
  };

  const putCommand = new PutCommand({
    TableName: TABLE_NAME,
    Item: updatedUser,
  });

  await docClient.send(putCommand);
  return updatedUser;
}

export async function unsubscribe(paddleCustomerId: string) {
  // Scan the table to find the user with matching customerId
  const scanCommand = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "paddleCustomerId = :paddleCustomerId",
    ExpressionAttributeValues: {
      ":paddleCustomerId": paddleCustomerId,
    },
  });
  const result = await docClient.send(scanCommand);

  if (!result.Items || result.Items.length === 0) {
    throw new Error("User with paddleCustomerId not found");
  }

  const user = result.Items[0];

  const roles = new Set(user.roles || []);
  roles.delete("subscriber");

  // Remove customerId field
  const { paddleCustomerId: _, ...rest } = user;

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
}
