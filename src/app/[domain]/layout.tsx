import { appConfig } from "@/utils/config";
import { getSite } from "@/utils/serverActions/siteActions";
import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const site = await getSite(params.domain);
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
      creator: "@vercel",
    },
    icons: [iconUrl],
    metadataBase: new URL(`https://${params.domain}`),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const { domain } = params;

  return <>{children}</>;
}
