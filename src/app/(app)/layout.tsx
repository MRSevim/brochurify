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
import { appConfig } from "@/utils/config";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

const title = "Brochurify";
const description =
  "Design single page brochurelike websites and host them with out platform for free or get your build's html code.";

export const metadata: Metadata = {
  title: {
    template: "%s | Brochurify",
    default: title,
  },
  description,
  keywords:
    "free website builder,create website free, make a one page website, website builder for small business,no code website builder,portfolio website builder,brochure website builder",
  openGraph: {
    title,
    description,
    url: "https://www" + appConfig.DOMAIN_EXTENSION,
    siteName: title,
    type: "website",
    images: [
      {
        url: `https://www${appConfig.DOMAIN_EXTENSION}/hero.png`,
        width: 1200,
        height: 630,
        alt: "Brochurify - One Page Website Builder",
      },
    ],
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
              className={"flex flex-col h-screen " + (!lightMode ? "dark" : "")}
            >
              <Header />
              <ToastContainer />
              {children}
              <Footer />
            </body>
          </GoogleOAuthProvider>
        </ClientWrapper>
      </StyledComponentsRegistry>
    </html>
  );
}
