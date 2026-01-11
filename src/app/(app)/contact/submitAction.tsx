"use server";
import { appConfig } from "@/utils/config";
import { serverEnv } from "@/utils/serverConfig";
import { Resend } from "resend";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export const submitAction = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  try {
    await resend.emails.send({
      from: "contact@" + appConfig.BASE_DOMAIN,
      to: serverEnv.MY_EMAIL,
      subject: "Contact Form Submitted in Brochurify",
      text: `Name: ${name} \nEmail: ${email}\n\nMessage: ${message}`,
    });

    return { error: "", successMessage: "Thank you for your message..." };
  } catch (error: any) {
    return { error: error.message, successMessage: "" };
  }
};
