import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { subscribe, unsubscribe } from "@/utils/db/userHelpers";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      throw Error("Required env secrets not set!");
    }

    const rawBody = await request.text();
    const signature = Buffer.from(
      request.headers.get("X-Signature") ?? "",
      "hex"
    );

    if (signature.length === 0 || rawBody.length === 0) {
      throw Error("Invalid request");
    }

    const hmac = Buffer.from(
      crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
      "hex"
    );

    if (!crypto.timingSafeEqual(hmac, signature)) {
      throw Error("Invalid request");
    }
    const data = JSON.parse(rawBody);
    const event = data?.meta?.event_name;
    const userId = data?.meta?.custom_data?.user_id;
    const lemonsqueezySubscriptionId = data?.data?.id;

    if (!event || !lemonsqueezySubscriptionId) {
      throw Error("Missing event name or lemonsqueezySubscriptionId");
    }
    // The request is valid, parse the data here
    if (event === "subscription_created") {
      if (!userId) {
        throw Error("Missing userId");
      }
      await subscribe(userId, lemonsqueezySubscriptionId);
    } else if (event === "subscription_expired") {
      await unsubscribe(lemonsqueezySubscriptionId);
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
