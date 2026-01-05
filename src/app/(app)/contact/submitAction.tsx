"use server";
import { appConfig, env } from "@/utils/config";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const submitAction = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  try {
    await resend.emails.send({
      from: "contact@" + appConfig.BASE_DOMAIN,
      to: env.MY_EMAIL,
      subject: "Contact Form Submitted in Brochurify",
      text: `Name: ${name} \nEmail: ${email}\n\nMessage: ${message}`,
    });

    return { error: "", successMessage: "Thank you for your message..." };
  } catch (error: any) {
    return { error: error.message, successMessage: "" };
  }
};
