"use server";
import { createOrUpdateUser } from "../db/userHelpers";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { generateToken } from "./helpers";

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

    const { email, name } = ticket.getPayload() as TokenPayload;
    if (!email || !name) {
      throw Error("Invalid Google payload");
    }
    const cookieStore = await cookies();
    const user = await createOrUpdateUser({
      email,
      username: name,
    });

    generateToken(cookieStore, user.userId, rememberMe);

    return { user, error: "" };
  } catch (error: any) {
    console.error("Login failed:", error);
    return { user: undefined, error: error.message };
  }
};

export const logoutAction = async () => {};
