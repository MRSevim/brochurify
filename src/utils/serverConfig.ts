import "server-only";

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const serverEnv = {
  ENV: requiredEnv("NEXT_PUBLIC_ENV"),
  MY_EMAIL: requiredEnv("MY_EMAIL"),
  APP_URL: requiredEnv("APP_URL"),
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  PADDLE_API_KEY: requiredEnv("PADDLE_API_KEY"),
  NEXT_PUBLIC_PADDLE_SUB_PRICE_ID: requiredEnv(
    "NEXT_PUBLIC_PADDLE_SUB_PRICE_ID",
  ),
  NEXT_PUBLIC_PADDLE_ENV: requiredEnv("NEXT_PUBLIC_PADDLE_ENV"),
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: requiredEnv(
    "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
  ),
  PADDLE_WEBHOOK_SECRET: requiredEnv("PADDLE_WEBHOOK_SECRET"),
  GOOGLE_CLIENT_ID: requiredEnv("GOOGLE_CLIENT_ID"),
  RESEND_API_KEY: requiredEnv("RESEND_API_KEY"),
  AWS_ACCESS_KEY_ID: requiredEnv("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: requiredEnv("AWS_SECRET_ACCESS_KEY"),
  AWS_REGION: requiredEnv("AWS_REGION"),
  AWS_CLOUDFRONT_URL: requiredEnv("AWS_CLOUDFRONT_URL"),
  DB_TABLE_NAME: requiredEnv("DB_TABLE_NAME"),
  S3_BUCKET_NAME: requiredEnv("S3_BUCKET_NAME"),
  VERCEL_API_TOKEN: requiredEnv("VERCEL_API_TOKEN"),
  REDIS_HOST: requiredEnv("REDIS_HOST"),
  REDIS_PASSWORD: requiredEnv("REDIS_PASSWORD"),
};
