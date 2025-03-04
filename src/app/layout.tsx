import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import ClientWrapper from "@/utils/ClientWrapper";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brochurify",
  description:
    "Design single page websites with the builder and get the html file",
  keywords: "builder,website builder,html generator,html",
  openGraph: {
    title: "Brochurify",
    description:
      "Design single page websites with the builder and get the html file",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lightMode = cookieStore.get("lightMode")?.value === "true";

  return (
    <html lang="en" className={roboto_mono.className}>
      <ClientWrapper lightMode={lightMode}>
        <body className={!lightMode ? "dark" : ""}>
          <Header />
          <ToastContainer />
          {children}
        </body>
      </ClientWrapper>
    </html>
  );
}
