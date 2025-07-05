"use server";
import { cookies } from "next/headers";
import {
  requestCustomDomain,
  checkVerificationStatus,
  removeCustomDomain,
} from "../db/customDomainHelpers";

export const requestCustomDomainAction = async (id: string, domain: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const records = await requestCustomDomain(id, domain, jwt);
    return { records };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const checkVerificationStatusAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const status = await checkVerificationStatus(id, jwt);
    return { status, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const removeCustomDomainAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    await removeCustomDomain(id, jwt);
    return "";
  } catch (error: any) {
    return error.message;
  }
};
