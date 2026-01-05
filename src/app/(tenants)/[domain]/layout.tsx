import { appConfig, env } from "@/utils/config";
import { notFound } from "next/navigation";
import { hasType } from "@/utils/EditorHelpers";
import {
  fullStylesWithIdsGenerator,
  styleGenerator,
  variablesGenerator,
} from "@/utils/StyleGenerators";
import { getCssReset } from "@/utils/StyleGenerators";
import { Layout, PropsWithId } from "@/utils/Types";
import Effects from "./Effects";
import { mapOverFonts } from "@/utils/GoogleFonts";
import { getUsedFonts } from "@/utils/getUsedFonts";
import { cache } from "react";
import { Metadata } from "next";

async function getSiteCached(domain: string) {
  const res = await fetch(`${env.APP_URL}/api/getSite?domain=${domain}`, {
    next: { revalidate: 600 }, // 10 minutes
  });

  if (!res.ok) return undefined;
  return await res.json();
}
const get = cache(async (domain: string) => {
  const site = await getSiteCached(domain);
  return site;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const site = await get(domain);
  if (!site || !site.editor) {
    return {};
  }

  const pageWise = site.editor.pageWise;
  const { title, description, keywords, image, iconUrl } = pageWise;
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
  };
}

export default async function SiteLayout({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  const site = await get(domain);

  if (!site || !site.editor) {
    return notFound();
  }
  const pageWise = site.editor.pageWise;
  const layout = site.editor.layout;
  const variables = site.editor.variables;
  const { title, description, keywords, canonical, image, iconUrl, ...rest } =
    pageWise;
  const fullstylesWithIds =
    fullStylesWithIdsGenerator(layout, false) +
    fullStylesWithIdsGenerator(layout, true);
  const variablesString = variablesGenerator(variables);

  const styles = (
    <style>{`
        ${getCssReset(pageWise)}
          body {
          ${variablesString}
          ${styleGenerator(rest)}
          }
          html {
            height:100%;
            width:100%
          }  
          ${fullstylesWithIds}  
        `}</style>
  );

  const fonts = getUsedFonts(layout, pageWise);
  const fontLinks = mapOverFonts(fonts, true);
  return (
    <html>
      <head>
        {hasType(layout, "icon") && (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          />
        )}
        {styles}
        {fontLinks}
      </head>

      <body>
        <Effects />
        {layout.map((item: Layout) => {
          return <RenderedComponent key={item.id} item={item} />;
        })}
      </body>
    </html>
  );
}

const RenderedComponent = ({ item }: { item: Layout }) => {
  const { type } = item;
  const isFixed = type === "fixed";
  const Component = componentList[item.type as keyof typeof componentList];
  const id = item.id;

  return (
    <div
      className={`block ${isFixed ? "" : "relative"}`}
      id={`idwrapper${item.id}`}
    >
      <div
        className="flex wAndHFull center"
        {...(item.props.anchorId ? { id: `user-${item.props.anchorId}` } : {})}
      >
        <Component id={"id" + id} {...item.props}>
          {item.props.child?.map((childItem) => (
            <RenderedComponent key={childItem.id} item={childItem} />
          ))}
        </Component>
      </div>
    </div>
  );
};

const componentList = {
  button: (props: PropsWithId) => (
    <a
      id={props.id}
      href={props.href}
      target={props.newTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="element wAndHFull"
    >
      {props.children}
    </a>
  ),
  column: (props: PropsWithId) => (
    <div id={props.id} className="element wAndHFull">
      {props.children}
    </div>
  ),
  text: (props: PropsWithId) => (
    <div
      id={props.id}
      className="element wAndHFull"
      dangerouslySetInnerHTML={{ __html: props.text || "" }}
    ></div>
  ),
  row: (props: PropsWithId) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
  image: (props: PropsWithId) => (
    <img
      className="element wAndHFull"
      id={props.id}
      src={props.src || undefined}
      alt={props.alt || ""}
    />
  ),
  audio: (props: PropsWithId) => (
    <audio className="element wAndHFull" id={props.id} controls>
      <source src={props.src || undefined}></source>
      Your browser does not support the audio tag.
    </audio>
  ),
  video: (props: PropsWithId) => (
    <video className="element wAndHFull" id={props.id} controls>
      <source src={props.src || undefined}></source>
      Your browser does not support the video tag.
    </video>
  ),
  container: (props: PropsWithId) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
  divider: (props: PropsWithId) => (
    <hr className="element wAndHFull" id={props.id} />
  ),
  icon: (props: PropsWithId) => (
    <i
      id={props.id}
      className={`element wAndHFull ${props.iconType ? `bi bi-${props.iconType}` : ""}`}
    />
  ),
  fixed: (props: PropsWithId) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
};
