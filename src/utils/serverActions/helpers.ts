import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";
import { getUserProfile } from "../db/userHelpers";
import { StringOrUnd } from "../Types";
import puppeteer, { Browser } from "puppeteer";

let browser: Browser | null = null;

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

export const getScreenSnapshot = async (html: string) => {
  //launch new puppeteer instances in prod to prevent memory leaks
  const isDev = process.env.NODE_ENV === "development";
  if (isDev && !browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
  }
  const instance = isDev ? browser : await puppeteer.launch({ headless: true });
  if (!instance) throw Error("Puppeteer instance non existent");

  try {
    const page = await instance.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setContent(html, {
      waitUntil: isDev ? "domcontentloaded" : "networkidle0",
    }); // domcontentloaded is faster than networkidle0

    const buffer = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: true,
    });
    await page.close();
    return buffer;
  } catch (error: any) {
    throw Error(error);
  } finally {
    if (!isDev && instance) {
      await instance.close(); // always close in prod
    }
  }
};
