import { NextRequest, NextResponse } from "next/server";
import { subscribe, unsubscribe } from "@/features/auth/lib/db/userHelpers";
import {
  Environment,
  EventName,
  SubscriptionNotification,
} from "@paddle/paddle-node-sdk";
import { Paddle } from "@paddle/paddle-node-sdk";
import { serverEnv } from "@/utils/serverConfig";
import { env } from "@/utils/config";

const paddle = new Paddle(serverEnv.PADDLE_API_KEY, {
  environment:
    env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
      ? Environment.sandbox
      : Environment.production,
});

export async function POST(request: NextRequest) {
  try {
    const signature = (request.headers.get("paddle-signature") as string) || "";
    // req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
    // If express returned a JSON, remove any other middleware that might have processed raw request to object
    const rawRequestBody = (await request.text()) || "";
    // Replace `PADDLE_WEBHOOK_SECRET` with the secret key in notifications from vendor dashboard
    const secretKey = serverEnv.PADDLE_WEBHOOK_SECRET || "";
    if (!signature || !rawRequestBody) {
      throw Error("Missing signature or rawRequestBody");
    }
    // The `unmarshal` function will validate the integrity of the webhook and return an entity
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );
    const event = eventData.eventType;
    const data = eventData.data as SubscriptionNotification;
    const paddleCustomerId = data.customerId;

    if (!paddleCustomerId) {
      throw Error("Missing paddleCustomerId");
    }

    if (event === EventName.SubscriptionActivated) {
      const customData = data.customData as { userId: string };
      const userId = customData.userId;
      // The request is valid, parse the data here
      if (!userId) {
        throw Error("Missing userId");
      }
      await subscribe(userId, paddleCustomerId);
    } else if (event === EventName.SubscriptionCanceled) {
      await unsubscribe(paddleCustomerId);
    }

    return NextResponse.json("OK", { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
      }
    );
  }
}
