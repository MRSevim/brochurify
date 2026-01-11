"use server";
import {
  createOrUpdateUser,
  deleteUser,
  getUserProfile,
} from "../lib/db/userHelpers";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { generateToken } from "./helpers";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { serverEnv } from "@/utils/serverConfig";
import { env } from "../../../utils/config";

export const loginAction = async (
  googleCredential: any,
  rememberMe: boolean
) => {
  try {
    const CLIENT_ID_GOOGLE = serverEnv.GOOGLE_CLIENT_ID;

    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: googleCredential,
      audience: CLIENT_ID_GOOGLE,
    });

    const { email, name, picture } = ticket.getPayload() as TokenPayload;
    if (!email || !name || !picture) {
      throw Error("Invalid Google payload");
    }

    const cookieStore = await cookies();
    const user = await createOrUpdateUser({
      email,
      username: name,
      image: picture,
    });

    generateToken(cookieStore, user.userId, rememberMe);

    return { user, error: "" };
  } catch (error: any) {
    return { user: undefined, error: error.message };
  }
};

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteUserAction = async () => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;
    await deleteUser(jwt);
    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserAction = async () => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;
    const user = await getUserProfile(jwt);
    return { user, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

const paddle = new Paddle(serverEnv.PADDLE_API_KEY, {
  environment:
    env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
      ? Environment.sandbox
      : Environment.production,
});

export const getPortalLink = async (custId: string) => {
  try {
    const subscriptionCollection = paddle.subscriptions.list({
      customerId: [custId],
    });

    const subs = await subscriptionCollection.next();
    const subIds = subs.map((item) => item.id);

    const session = await paddle.customerPortalSessions.create(custId, subIds);

    return { portalLink: session.urls.general.overview };
  } catch (error: any) {
    return { error: error.message };
  }
};
