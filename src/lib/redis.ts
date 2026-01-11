import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { serverEnv } from "@/utils/serverConfig";

export const connection = new Redis({
  host: serverEnv.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
});

export const snapshotQueue = new Queue("snapshot-queue", {
  connection,
});
