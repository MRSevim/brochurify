import { v4 as uuidv4 } from "uuid";
import { deleteFromS3, uploadToS3 } from "../s3/helpers";
import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { checkRole, protect } from "../../features/auth/utils/helpers";
import { appConfig } from "../../utils/config";
import { serverEnv } from "../../utils/serverConfig";
import {
  ALLOWED_ICON_TYPES,
  ALLOWED_IMAGE_TYPES,
} from "@/utils/AllowedImageTypes";

const TABLE_NAME = serverEnv.DB_TABLE_NAME;

export async function uploadUserImageAndUpdateLibrary({
  base64,
  fileType,
  isIcon,
}: {
  base64: string;
  fileType: string;
  isIcon: boolean;
}): Promise<{ url: string; size: number; createdAt: string }> {
  const user = await protect();
  checkRole(user, "subscriber");
  const userId = user.userId;

  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const sizeInBytes = buffer.length;

  const allowed = isIcon ? ALLOWED_ICON_TYPES : ALLOWED_IMAGE_TYPES;

  if (!allowed.includes(fileType)) {
    throw new Error("Unsupported image type");
  }

  const maxSize = appConfig.MAX_IMAGE_SIZE_MB;
  if (sizeInBytes > maxSize * 1024 * 1024) {
    throw new Error(`Image exceeds ${maxSize}MB limit`);
  }

  const currentImages = (await getImagesInner(userId)) || [];

  const maxNumber = appConfig.MAX_IMAGE_COUNT;
  if (currentImages.length >= maxNumber) {
    throw new Error(`Image limit (${maxNumber}) reached`);
  }

  const fileExtension = fileType.split("/")[1];
  const id = uuidv4();
  const fileKey = `images/${id}.${fileExtension}`;

  const url = await uploadToS3({
    buffer,
    key: fileKey,
    contentType: fileType,
  });

  const imageObj = {
    userId: userId,
    id: "image#" + id,
    url,
    size: sizeInBytes,
    createdAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: imageObj,
  });

  await docClient.send(command);
  return imageObj;
}

export async function deleteUserImageAndUpdateLibrary({
  imageUrl,
}: {
  imageUrl: string;
}) {
  const user = await protect();
  checkRole(user, "subscriber");
  const userId = user.userId;

  // Extract id and extension
  const match = imageUrl.match(/\/images\/([^/.]+)\.([^.\/]+)$/);
  if (!match) {
    throw new Error("Invalid image URL format");
  }
  const id = match[1];
  const extension = match[2];

  // Construct S3 key with userId and image file
  const key = `images/${id}.${extension}`;
  await deleteFromS3(key);

  // Construct DynamoDB id
  const dynamoId = `image#${id}`;

  // Delete item from DynamoDB
  const deleteCommand = new DeleteCommand({
    TableName: serverEnv.DB_TABLE_NAME,
    Key: {
      userId,
      id: dynamoId,
    },
  });

  await docClient.send(deleteCommand);
}

export async function getUserImages(): Promise<{
  images: { url: string; size: number; createdAt: string }[];
  totalSize: number;
}> {
  const user = await protect();
  checkRole(user, "subscriber");
  const userId = user.userId;
  const items = await getImagesInner(userId);

  // items is an array of image objects
  const images =
    items?.map(({ url, size, createdAt }) => ({
      url,
      size,
      createdAt,
    })) ?? [];

  const totalSize = images.reduce((acc, img) => acc + img.size, 0);
  return {
    images,
    totalSize,
  };
}

const getImagesInner = async (userId: string) => {
  const queryCommand = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression:
      "userId = :userId AND begins_with(id, :imagePrefix)",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":imagePrefix": "image#",
    },
  });

  const { Items } = await docClient.send(queryCommand);
  return Items;
};
