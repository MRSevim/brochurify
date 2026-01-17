import { env } from "@/utils/config";
import { serverEnv } from "@/utils/serverConfig";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

export const paddle =
  globalThis.paddleInstance ??
  new Paddle(serverEnv.PADDLE_API_KEY, {
    environment:
      env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
        ? Environment.sandbox
        : Environment.production,
  });

if (serverEnv.ENV !== "production") {
  globalThis.paddleInstance = paddle;
}
