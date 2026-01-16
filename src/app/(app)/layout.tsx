import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import ClientWrapper, {
  StyledComponentsRegistry,
  ToggleContexts,
} from "@/utils/ClientWrapper";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";
import { googleFontOptions, mapOverFonts } from "@/utils/GoogleFonts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer/Footer";
import { appConfig } from "@/utils/config";
import { serverEnv } from "@/utils/serverConfig";
import jwt from "jsonwebtoken";
import { getUser } from "@/features/auth/utils/helpers";
import { User } from "@/utils/Types";
import { Provider as LightModeProvider } from "@/features/theme/utils/DarkModeContext";
import { Provider as ViewModeProvider } from "@/features/builder/utils/contexts/ViewModeContext";
import { Provider as PreviewProvider } from "@/features/builder/utils/contexts/PreviewContext";
import { Provider as ZoomProvider } from "@/features/builder/utils/contexts/ZoomContext";
import { Provider as AddSectionToggleProvider } from "@/features/builder/utils/contexts/AddSectionToggleContext";
import { Provider as UserProvider } from "@/features/auth/utils/contexts/UserContext";
import { Provider as SubscribePopupProvider } from "@/utils/contexts/SubscribePopupContext";
import { EditorRefProvider } from "@/features/builder/utils/contexts/EditorRefContext";
import { Provider as PublishPopupProvider } from "@/features/builder/utils/contexts/PublishPopupContext";
import { Provider as PaddleContextProvider } from "@/features/auth/utils/contexts/PaddleContext";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

const title = "Brochurify";
const description =
  "Design single page brochurelike websites and host them with out platform for free or get your build's html code.";
const url = "https://www" + appConfig.DOMAIN_EXTENSION;

export const metadata: Metadata = {
  title: {
    template: "%s | Brochurify",
    default: title,
  },
  alternates: {
    canonical: url,
  },
  description,
  keywords:
    "free website builder,create website free, make a one page website, website builder for small business,no code website builder,portfolio website builder,brochure website builder",
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    type: "website",
    images: [
      {
        url: `${url}/hero.png`,
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
  const token = cookieStore.get("jwt")?.value;
  let userFromCookie: User;
  if (token) {
    const decoded = jwt.verify(token, serverEnv.JWT_SECRET) as unknown as {
      userId: string;
    };

    userFromCookie = (await getUser(decoded.userId)) as User;
  }

  return (
    <html lang="en" className={roboto_mono.className}>
      <head>
        {mapOverFonts(
          googleFontOptions.map((font) => font.title),
          true
        )}
      </head>
      <StyledComponentsRegistry>
        <ToggleContexts>
          <PublishPopupProvider>
            <LightModeProvider lightModeFromCookie={lightMode}>
              <ViewModeProvider>
                <ZoomProvider>
                  <UserProvider UserFromCookie={userFromCookie}>
                    <PaddleContextProvider>
                      <SubscribePopupProvider>
                        <AddSectionToggleProvider>
                          <EditorRefProvider>
                            <ClientWrapper>
                              <PreviewProvider>
                                <GoogleOAuthProvider
                                  clientId={serverEnv.GOOGLE_CLIENT_ID}
                                >
                                  <body
                                    className={
                                      "flex flex-col h-screen " +
                                      (!lightMode ? "dark" : "")
                                    }
                                  >
                                    <Header />
                                    <ToastContainer />
                                    {children}
                                    <Footer />
                                  </body>
                                </GoogleOAuthProvider>
                              </PreviewProvider>
                            </ClientWrapper>
                          </EditorRefProvider>
                        </AddSectionToggleProvider>
                      </SubscribePopupProvider>
                    </PaddleContextProvider>
                  </UserProvider>
                </ZoomProvider>
              </ViewModeProvider>
            </LightModeProvider>
          </PublishPopupProvider>
        </ToggleContexts>
      </StyledComponentsRegistry>
    </html>
  );
}
