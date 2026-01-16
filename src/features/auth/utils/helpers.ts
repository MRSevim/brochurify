import "server-only";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../../../lib/db/db";
import { serverEnv } from "@/utils/serverConfig";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const TABLE_NAME = serverEnv.DB_TABLE_NAME;

export const generateToken = async (
  cookieStore: ReadonlyRequestCookies,
  userId: string,
  rememberMe: boolean
) => {
  let token;
  let cookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: serverEnv.ENV !== "development", // Use secure cookies in production
    sameSite: "strict",
    path: "/",
  };
  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60;
    token = jwt.sign({ userId }, serverEnv.JWT_SECRET, {
      expiresIn: "30d",
    });
  } else {
    token = jwt.sign({ userId }, serverEnv.JWT_SECRET);
  }

  cookieStore.set("jwt", token, cookieOptions);

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

export const protect = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (token) {
    const decoded = jwt.verify(token, serverEnv.JWT_SECRET) as {
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
};

export const checkRole = (
  user: Record<string, any>,
  role: string,
  customError?: string
) => {
  if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
    throw new Error(customError || `Not authorized, ${role} role required`);
  }
};
