import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";
import { getUserProfile } from "../db/userHelpers";
import { StringOrUnd } from "../Types";

export const generateToken = (
  cookies: ReadonlyRequestCookies,
  userId: string,
  rememberMe: boolean
) => {
  let token;
  let cookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.ENV !== "development", // Use secure cookies in production
    sameSite: "strict",
    path: "/",
  };
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60;
    token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
  } else {
    token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  }
  cookies.set("jwt", token, cookieOptions);

  return token;
};

export const protect = async (token: StringOrUnd) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      const user = await getUserProfile(decoded.userId);
      if (!user) {
        throw new Error("Not authorized, token failed, Login please");
      }
      return user;
    } else {
      throw new Error("Not authorized, no token, Login please");
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
