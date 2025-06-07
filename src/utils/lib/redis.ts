import { Redis } from "ioredis";

const isProduction = process.env.ENV === "production";

export const connection = new Redis({
  host: isProduction ? process.env.ELASTICACHE_HOST : "localhost",
  port: isProduction ? Number(process.env.ELASTICACHE_PORT) || 6379 : 6379,
  maxRetriesPerRequest: null,
});
