"use server";
import { returnErrorFromUnknown } from "@/utils/Helpers";
import {
  requestCustomDomain,
  checkVerificationStatus,
  removeCustomDomain,
} from "../../lib/customDomainHelpers";

export const requestCustomDomainAction = async (id: string, domain: string) => {
  try {
    const records = await requestCustomDomain(id, domain);
    return { records, error: "" };
  } catch (error) {
    return { records: undefined, ...returnErrorFromUnknown(error) };
  }
};

export const checkVerificationStatusAction = async (id: string) => {
  try {
    const status = await checkVerificationStatus(id);
    return { status, error: "" };
  } catch (error) {
    return { status: undefined, ...returnErrorFromUnknown(error) };
  }
};
export const removeCustomDomainAction = async (id: string) => {
  try {
    await removeCustomDomain(id);
    return { error: "" };
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
};
