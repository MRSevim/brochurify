const isDev = process.env.NEXT_PUBLIC_ENV === "development";

export const appConfig = {
  MONTHLY_SUB_PRICE: 5,
  DOMAIN_EXTENSION: isDev ? ".localhost:3000" : ".brochurify.app",
  BASE_DOMAIN: isDev ? "localhost:3000" : "brochurify.app",
  MAX_IMAGE_SIZE_MB: 5,
  MAX_IMAGE_COUNT: 50,
  MAX_PROJECT_SIZE_KB: 400,
  FREE_ACC_PROJECT_LIMIT: 3,
  SUB_ACC_PROJECT_LIMIT: 10,
};

//Directly getting public env variables since next.js inlines them and they are not available during runtime
export const env = {
  NEXT_PUBLIC_PADDLE_SUB_PRICE_ID: process.env.NEXT_PUBLIC_PADDLE_SUB_PRICE_ID!,
  NEXT_PUBLIC_PADDLE_ENV: process.env.NEXT_PUBLIC_PADDLE_ENV!,
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
};
