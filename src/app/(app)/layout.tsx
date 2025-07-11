import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import ClientWrapper, { StyledComponentsRegistry } from "@/utils/ClientWrapper";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";
import Script from "next/script";
import { googleFontOptions, mapOverFonts } from "@/utils/GoogleFonts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer/Footer";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brochurify",
  description:
    "Design single page brochurelike websites and host them with out platform or alternatively get the html code.",
  keywords:
    "builder,website builder,html generator,html, website hosting, single page website",
  openGraph: {
    title: "Brochurify",
    description:
      "Design single page brochurelike websites and host them with out platform or alternatively get the html code.",
  },
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lightMode = cookieStore.get("lightMode")?.value === "true";
  const user = cookieStore.get("user")?.value;
  const userFromCookie = user
    ? JSON.parse(decodeURIComponent(user))
    : undefined;

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
      <StyledComponentsRegistry>
        <ClientWrapper lightMode={lightMode} UserFromCookie={userFromCookie}>
          <GoogleOAuthProvider
            clientId={process.env.GOOGLE_CLIENT_ID as string}
          >
            <body
              className={
                "flex flex-col h-screen justify-between " +
                (!lightMode ? "dark" : "")
              }
            >
              <div>
                <Header />
                <ToastContainer />
                {children}
              </div>
              <Footer />
            </body>
          </GoogleOAuthProvider>
        </ClientWrapper>
      </StyledComponentsRegistry>
    </html>
  );
}
