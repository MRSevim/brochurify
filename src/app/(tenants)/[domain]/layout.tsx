import { appConfig } from "@/utils/config";
import { notFound } from "next/navigation";
import { hasType } from "@/features/builder/utils/EditorHelpers";
import {
  fullStylesWithIdsGenerator,
  styleGenerator,
  variablesGenerator,
} from "@/utils/StyleGenerators";
import { getCssReset } from "@/utils/StyleGenerators";
import Effects from "./Effects";
import { mapOverFonts, getUsedFonts } from "@/utils/fontUtils";
import { Metadata } from "next";
import { serverEnv } from "@/utils/serverConfig";
import {
  AudioPropsForRendering,
  ButtonPropsForRendering,
  ColumnPropsForRendering,
  ContainerPropsForRendering,
  DividerPropsForRendering,
  FixedPropsForRendering,
  IconPropsForRendering,
  ImagePropsForRendering,
  Layout,
  LayoutTypes,
  RowPropsForRendering,
  TextPropsForRendering,
  VideoPropsForRendering,
} from "@/features/builder/utils/types/propTypes.d";
import { JSX } from "react";

async function getSiteCached(domain: string) {
  const res = await fetch(`${serverEnv.APP_URL}/api/getSite?domain=${domain}`, {
    next: { revalidate: 600 }, // 10 minutes
  });

  if (!res.ok) return undefined;
  return await res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const site = await getSiteCached(domain);
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

  const site = await getSiteCached(domain);

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
  const id = item.id;
  let Component: JSX.Element;

  switch (type) {
    case "button":
      Component = componentList.button({
        ...item.props,
        id: "id" + id,
        children: item.props.child.map((childItem) => (
          <RenderedComponent key={childItem.id} item={childItem} />
        )),
      });
      break;
    case "column":
      Component = componentList.column({
        ...item.props,
        id: "id" + id,
        children: item.props.child.map((childItem) => (
          <RenderedComponent key={childItem.id} item={childItem} />
        )),
      });
      break;
    case "text":
      Component = componentList.text({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "row":
      Component = componentList.row({
        ...item.props,
        id: "id" + id,
        children: item.props.child.map((childItem) => (
          <RenderedComponent key={childItem.id} item={childItem} />
        )),
      });
      break;
    case "image":
      Component = componentList.image({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "audio":
      Component = componentList.audio({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "video":
      Component = componentList.video({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "container":
      Component = componentList.container({
        ...item.props,
        id: "id" + id,
        children: item.props.child.map((childItem) => (
          <RenderedComponent key={childItem.id} item={childItem} />
        )),
      });
      break;
    case "divider":
      Component = componentList.divider({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "icon":
      Component = componentList.icon({
        ...item.props,
        id: "id" + id,
      });
      break;
    case "fixed":
      Component = componentList.fixed({
        ...item.props,
        id: "id" + id,
        children: item.props.child.map((childItem) => (
          <RenderedComponent key={childItem.id} item={childItem} />
        )),
      });
      break;
    default:
      throw Error("Pass a valid type to RenderedComponent");
  }

  return (
    <div
      className={`block ${isFixed ? "" : "relative"}`}
      id={`idwrapper${item.id}`}
    >
      <div
        className="flex wAndHFull center"
        {...(item.props.anchorId ? { id: `user-${item.props.anchorId}` } : {})}
      >
        {Component}
      </div>
    </div>
  );
};

const componentList: Record<LayoutTypes, any> = {
  button: (props: ButtonPropsForRendering) => (
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
  column: (props: ColumnPropsForRendering) => (
    <div id={props.id} className="element wAndHFull">
      {props.children}
    </div>
  ),
  text: (props: TextPropsForRendering) => (
    <div
      id={props.id}
      className="element wAndHFull"
      dangerouslySetInnerHTML={{ __html: props.text || "" }}
    ></div>
  ),
  row: (props: RowPropsForRendering) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
  image: (props: ImagePropsForRendering) => (
    <img
      className="element wAndHFull"
      id={props.id}
      src={props.src || undefined}
      alt={props.alt || ""}
    />
  ),
  audio: (props: AudioPropsForRendering) => (
    <audio className="element wAndHFull" id={props.id} controls>
      <source src={props.src || undefined}></source>
      Your browser does not support the audio tag.
    </audio>
  ),
  video: (props: VideoPropsForRendering) => (
    <video className="element wAndHFull" id={props.id} controls>
      <source src={props.src || undefined}></source>
      Your browser does not support the video tag.
    </video>
  ),
  container: (props: ContainerPropsForRendering) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
  divider: (props: DividerPropsForRendering) => (
    <hr className="element wAndHFull" id={props.id} />
  ),
  icon: (props: IconPropsForRendering) => (
    <i
      id={props.id}
      className={`element wAndHFull ${props.iconType ? `bi bi-${props.iconType}` : ""}`}
    />
  ),
  fixed: (props: FixedPropsForRendering) => (
    <div className="element wAndHFull" id={props.id}>
      {props.children}
    </div>
  ),
};
