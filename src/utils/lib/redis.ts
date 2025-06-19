import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const snapshotQueue = new Queue("snapshot-queue", {
  connection,
});
