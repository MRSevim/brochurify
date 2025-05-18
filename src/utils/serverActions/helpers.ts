import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";

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
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
  } else {
    token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  }
  cookies.set("jwt", token, cookieOptions);

  return token;
};
