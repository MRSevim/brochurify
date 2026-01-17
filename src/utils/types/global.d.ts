import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Paddle } from "@paddle/paddle-node-sdk";
import { Queue } from "bullmq";
import type { Redis } from "ioredis";

declare global {
  var redis: {
    redisInstance: Redis | undefined;
    snapshotQueue: Queue | undefined;
  };
  var s3Client: S3Client | undefined;
  var dynamodbClient: DynamoDBDocumentClient | undefined;
  var paddleInstance: Paddle;
}

export {};
