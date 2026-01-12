"use server";
import {
  requestCustomDomain,
  checkVerificationStatus,
  removeCustomDomain,
} from "../../../../lib/db/customDomainHelpers";

export const requestCustomDomainAction = async (id: string, domain: string) => {
  try {
    const records = await requestCustomDomain(id, domain);
    return { records };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const checkVerificationStatusAction = async (id: string) => {
  try {
    const status = await checkVerificationStatus(id);
    return { status, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const removeCustomDomainAction = async (id: string) => {
  try {
    await removeCustomDomain(id);
    return "";
  } catch (error: any) {
    return error.message;
  }
};
