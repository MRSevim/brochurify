"use server";
import { cookies } from "next/headers";
import {
  checkCertificateStatus,
  getCertificateValidationRecord,
  requestCustomDomainCertificate,
} from "../db/customDomainHelpers";

export const requestCertificateAction = async (id: string, domain: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    await requestCustomDomainCertificate(id, domain, jwt);
    return "";
  } catch (error: any) {
    return error.message;
  }
};

export const getCertificateValidationRecordAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const records = await getCertificateValidationRecord(id, jwt);
    return { records, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const checkCertificateStatusAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const status = await checkCertificateStatus(id, jwt);
    return { status, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
