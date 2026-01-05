import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { env } from "../config";

export const connection = new Redis({
  host: env.REDIS_HOST,
  port: 6379,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const snapshotQueue = new Queue("snapshot-queue", {
  connection,
});
