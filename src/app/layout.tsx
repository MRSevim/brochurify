import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import ClientWrapper from "@/utils/ClientWrapper";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";
import Script from "next/script";
import { googleFontOptions, mapOverFonts } from "@/utils/GoogleFonts";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  const user = cookieStore.get("user")?.value;
  const userFromCookie = user ? JSON.parse(user) : undefined;

  return (
    <html lang="en" className={roboto_mono.className}>
      <head>
        {process.env.ENV === "production" && (
          <>
            <Script
              async
              src={
                "https://www.googletagmanager.com/gtag/js?id=" +
                process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
              }
            />
            <Script id="google-analytics">
              {` window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
            }
            gtag("js", new Date());
            
            gtag("config", "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}");`}
            </Script>
          </>
        )}
        {mapOverFonts(
          googleFontOptions.map((font) => font.title),
          true
        )}
      </head>
      <ClientWrapper lightMode={lightMode} UserFromCookie={userFromCookie}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID as string}>
          <body
            className={"flex flex-col h-screen " + (!lightMode ? "dark" : "")}
          >
            <Header />
            <ToastContainer />
            {children}
          </body>
        </GoogleOAuthProvider>
      </ClientWrapper>
    </html>
  );
}
