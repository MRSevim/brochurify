import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { serverEnv } from "@/utils/serverConfig";

const isDev = serverEnv.ENV === "development";

export const connection =
  globalThis.redis?.redisInstance ??
  new Redis({
    host: serverEnv.REDIS_HOST,
    port: 6379,
    maxRetriesPerRequest: null,
    password: !isDev ? serverEnv.REDIS_PASSWORD : undefined,
  });

export const snapshotQueue =
  globalThis.redis?.snapshotQueue ??
  new Queue("snapshot-queue", {
    connection,
  });

if (isDev) {
  globalThis.redis ??= { redisInstance: undefined, snapshotQueue: undefined };
  globalThis.redis.redisInstance = connection;
  globalThis.redis.snapshotQueue = snapshotQueue;
}
