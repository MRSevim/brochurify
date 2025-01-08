import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Roboto_Mono } from "next/font/google";
import Header from "@/components/Header";
import ClientWrapper from "@/utils/ClientWrapper";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brochurify",
  description: "Design single page websites with ui and get the code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto_mono.className}>
      <ClientWrapper>
        <body>
          <Header />
          {children}
        </body>
      </ClientWrapper>
    </html>
  );
}
