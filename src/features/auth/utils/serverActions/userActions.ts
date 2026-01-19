"use server";
import {
  createOrUpdateUser,
  deleteUser,
  getUserProfile,
} from "../../lib/db/userHelpers";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { generateToken } from "../helpers";
import { serverEnv } from "@/utils/serverConfig";
import { redirect } from "next/navigation";
import { returnErrorFromUnknown } from "@/utils/Helpers";
import { paddle } from "../../lib/paddle";

export const loginAction = async (
  googleCredential: any,
  rememberMe: boolean,
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

    const user = await createOrUpdateUser({
      email,
      username: name,
      image: picture,
    });

    generateToken(await cookies(), user.userId, rememberMe);
  } catch (error) {
    return { user: undefined, ...returnErrorFromUnknown(error) };
  }
  redirect("/");
};

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
  redirect("/");
};

export const deleteUserAction = async () => {
  try {
    await deleteUser();
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
  redirect("/");
};

export const getUserAction = async () => {
  try {
    const user = await getUserProfile();
    return { user, error: "" };
  } catch (error) {
    return { user: undefined, ...returnErrorFromUnknown(error) };
  }
};

export const getPortalLink = async (custId: string) => {
  try {
    const subscriptionCollection = paddle.subscriptions.list({
      customerId: [custId],
    });

    const subs = await subscriptionCollection.next();
    const subIds = subs.map((item) => item.id);

    const session = await paddle.customerPortalSessions.create(custId, subIds);

    return { portalLink: session.urls.general.overview, error: "" };
  } catch (error) {
    return { portalLink: "", ...returnErrorFromUnknown(error) };
  }
};
