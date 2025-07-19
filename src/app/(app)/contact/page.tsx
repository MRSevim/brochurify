import { Metadata } from "next";
import ContactForm from "./Contact";

const description =
  "Contact form of Brochurify. Feel free to contact for suggestions, comments or more";
const title = "Contact";
export const metadata: Metadata = {
  title,
  description,
  keywords: "contact form of brochurify, contact form of website builder",
  openGraph: {
    title,
    description,
  },
};
export default function page() {
  return <ContactForm />;
}
