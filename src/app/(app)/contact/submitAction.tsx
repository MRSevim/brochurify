"use server";
import { appConfig } from "@/utils/config";
import { returnErrorFromUnknown } from "@/utils/Helpers";
import { serverEnv } from "@/utils/serverConfig";
import { Resend } from "resend";
import { ContactState } from "./Contact";

const resend = new Resend(serverEnv.RESEND_API_KEY);
const dev = serverEnv.ENV === "development";

export const submitAction = async (
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const obj = {
    from: "contact@" + appConfig.BASE_DOMAIN,
    to: serverEnv.MY_EMAIL,
    subject: "Contact Form Submitted in Brochurify",
    text: `Name: ${name} \nEmail: ${email}\n\nMessage: ${message}`,
  };
  try {
    if (dev) {
      console.log(obj);
    } else {
      await resend.emails.send(obj);
    }

    return { error: "", successMessage: "Thank you for your message..." };
  } catch (error) {
    return {
      ...returnErrorFromUnknown(error),
      successMessage: "",
      defaultValues: { message, email, name },
    };
  }
};
