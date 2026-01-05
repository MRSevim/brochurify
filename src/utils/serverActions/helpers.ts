import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";
import { StringOrUnd } from "../Types";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../db/db";
import { env } from "../config";

const TABLE_NAME = env.DB_TABLE_NAME;

export const generateToken = (
  cookies: ReadonlyRequestCookies,
  userId: string,
  rememberMe: boolean
) => {
  let token;
  let cookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: env.ENV !== "development", // Use secure cookies in production
    sameSite: "strict",
    path: "/",
  };
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60;
    token = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } else {
    token = jwt.sign({ userId }, env.JWT_SECRET);
  }
  cookies.set("jwt", token, cookieOptions);

  return token;
};

export const getUser = async (userId: string) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      userId,
      id: "profile",
    },
  });

  const response = await docClient.send(command);

  const user = response.Item;
  return user;
};

export const protect = async (token: StringOrUnd) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
      };

      const user = await getUser(decoded.userId);
      if (!user) {
        throw new Error("Not authorized, token failed, Login please");
      }
      return user;
    } else {
      throw new Error("Not authorized, no token, Login please");
    }
  } catch (error: any) {
    throw error;
  }
};

export const checkRole = (
  user: Record<string, any>,
  role: string,
  customError?: string
) => {
  try {
    if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
      throw new Error(customError || `Not authorized, ${role} role required`);
    }
  } catch (error: any) {
    throw error;
  }
};
