import { v4 as uuidv4 } from "uuid";
import { deleteFromS3, uploadToS3 } from "../s3/helpers";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./db";
import { checkRole, protect } from "../serverActions/helpers";

const TABLE_NAME = process.env.DB_TABLE_NAME;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_COUNT = 20;

const ALLOWED_IMAGE_TYPES = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];
export async function uploadUserImageAndUpdateLibrary({
  token,
  base64,
  fileType,
}: {
  token: string;
  base64: string;
  fileType: string;
}): Promise<{ url: string; size: number; createdAt: string }> {
  const user = await protect(token);
  checkRole(user, "subscriber");
  const userId = user.userId;

  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const sizeInBytes = buffer.length;

  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    throw new Error("Unsupported image type");
  }

  if (sizeInBytes > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error("Image exceeds 5MB limit");
  }

  const Item = await getImagesInner(userId);
  const currentImages = Item?.urls ?? [];

  if (currentImages.length >= MAX_IMAGE_COUNT) {
    throw new Error(`Image limit (${MAX_IMAGE_COUNT}) reached`);
  }

  const fileExtension = fileType.split("/")[1];
  const fileKey = `${userId}/images/${uuidv4()}.${fileExtension}`;

  const imageUrl = await uploadToS3({
    buffer,
    key: fileKey,
    contentType: fileType,
  });

  const imageObj = {
    url: imageUrl,
    size: sizeInBytes,
    createdAt: new Date().toISOString(),
  };

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      userId,
      id: "images",
    },
    UpdateExpression:
      "SET #urls = list_append(if_not_exists(#urls, :empty), :new), #total = if_not_exists(#total, :zero) + :size",
    ExpressionAttributeNames: {
      "#urls": "urls",
      "#total": "totalSize",
    },
    ExpressionAttributeValues: {
      ":empty": [],
      ":new": [imageObj],
      ":zero": 0,
      ":size": sizeInBytes,
    },
  });

  await docClient.send(command);
  return imageObj;
}

export async function deleteUserImageAndUpdateLibrary({
  token,
  imageUrl,
}: {
  token: string;
  imageUrl: string;
}) {
  const user = await protect(token);
  checkRole(user, "subscriber");
  const userId = user.userId;

  const url = new URL(imageUrl);
  const key = url.pathname.replace(/^\/[^/]+\//, ""); // remove "/<bucket>/"

  await deleteFromS3(key);

  const getCommand = new GetCommand({
    TableName: process.env.DB_TABLE_NAME!,
    Key: {
      userId,
      id: "images",
    },
  });

  const { Item } = await docClient.send(getCommand);
  const currentImages = Item?.urls ?? [];

  const filteredImages = currentImages.filter(
    (img: any) => img.url !== imageUrl
  );
  const deletedImage = currentImages.find((img: any) => img.url === imageUrl);
  const sizeReduction = deletedImage?.size ?? 0;

  const updateCommand = new UpdateCommand({
    TableName: process.env.DB_TABLE_NAME!,
    Key: {
      userId,
      id: "images",
    },
    UpdateExpression: "SET #urls = :urls, #total = :total",
    ExpressionAttributeNames: {
      "#urls": "urls",
      "#total": "totalSize",
    },
    ExpressionAttributeValues: {
      ":urls": filteredImages,
      ":total": Math.max((Item?.totalSize ?? 0) - sizeReduction, 0),
    },
  });

  await docClient.send(updateCommand);
}

export async function getUserImages(token: string): Promise<{
  images: { url: string; size: number; createdAt: string }[];
  totalSize: number;
}> {
  const user = await protect(token);
  checkRole(user, "subscriber");
  const userId = user.userId;
  const Item = await getImagesInner(userId);
  return {
    images: Item?.urls ?? [],
    totalSize: Item?.totalSize ?? 0,
  };
}

const getImagesInner = async (userId: string) => {
  const getCommand = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      userId,
      id: "images",
    },
  });

  const { Item } = await docClient.send(getCommand);
  return Item;
};
