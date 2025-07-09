"use server";
import {
  createOrUpdateUser,
  deleteUser,
  getUserProfile,
} from "../db/userHelpers";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { generateToken } from "./helpers";
import {
  getSubscription,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

export const loginAction = async (
  googleCredential: any,
  rememberMe: boolean
) => {
  try {
    const CLIENT_ID_GOOGLE = process.env.GOOGLE_CLIENT_ID;

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

export const getLemonSqueezyPortalLink = async (subId: string) => {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });
    const { data, error } = await getSubscription(subId);

    if (error) throw error;
    return { portalLink: data?.data.attributes["urls"]["customer_portal"] };
  } catch (error: any) {
    return { error: error.message };
  }
};
