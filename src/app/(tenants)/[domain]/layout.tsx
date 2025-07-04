import { ReactNode } from "react";
import { appConfig } from "@/utils/config";
import { getSite } from "@/utils/serverActions/siteActions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const site = await getSite(domain);
  if (!site || !site.editor) {
    return null;
  }
  const pageWise = site.editor.pageWise;
  const {
    title,
    description,
    keywords,
    image,
    iconUrl,
    googleAnalyticsTag,
    hideOverFlowBefore,
  } = pageWise;

  const url = `https://${site.customDomain || site.prefix + appConfig.DOMAIN_EXTENSION}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(iconUrl && { icons: [iconUrl] }),
    metadataBase: new URL(`https://${domain}`),
  };
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
