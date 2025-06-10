import { v4 as uuidv4 } from "uuid";
import { deleteFromS3, uploadToS3 } from "../s3/helpers";
import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
  try {
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

    const currentImages = (await getImagesInner(userId)) || [];

    if (currentImages.length >= MAX_IMAGE_COUNT) {
      throw new Error(`Image limit (${MAX_IMAGE_COUNT}) reached`);
    }

    const fileExtension = fileType.split("/")[1];
    const id = uuidv4();
    const fileKey = `${userId}/images/${id}.${fileExtension}`;

    await uploadToS3({
      buffer,
      key: fileKey,
      contentType: fileType,
    });

    const imageObj = {
      userId: userId,
      id: `image#${id}`,
      url: `/images/${id}.${fileExtension}`,
      size: sizeInBytes,
      createdAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: imageObj,
    });

    await docClient.send(command);
    return imageObj;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserImageAndUpdateLibrary({
  token,
  imageUrl,
}: {
  token: string;
  imageUrl: string;
}) {
  try {
    const user = await protect(token);
    checkRole(user, "subscriber");
    const userId = user.userId;

    // imageUrl example: "/images/12345.jpeg"
    // Extract id and extension
    const match = imageUrl.match(/^\/images\/([^/.]+)\.(.+)$/);
    if (!match) {
      throw new Error("Invalid image URL format");
    }
    const id = match[1];
    const extension = match[2];

    // Construct S3 key with userId and image file
    const key = `${userId}/images/${id}.${extension}`;
    await deleteFromS3(key);

    // Construct DynamoDB id
    const dynamoId = `image#${id}`;

    // Delete item from DynamoDB
    const deleteCommand = new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        userId,
        id: dynamoId,
      },
    });

    await docClient.send(deleteCommand);
  } catch (error) {
    throw error;
  }
}

export async function getUserImages(token: string): Promise<{
  images: { url: string; size: number; createdAt: string }[];
  totalSize: number;
}> {
  try {
    const user = await protect(token);
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
  } catch (error) {
    throw error;
  }
}

const getImagesInner = async (userId: string) => {
  try {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId AND begins_with(id, :prefix)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":prefix": "image",
      },
    });

    const { Items } = await docClient.send(queryCommand);
    return Items;
  } catch (error) {
    throw error;
  }
};
