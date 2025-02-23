import { hasType } from "./EditorHelpers";
import { styleGenerator } from "./Helpers";
import { Layout, PageWise, Style } from "./Types";
import { minify } from "htmlfy";
export const generateHTML = (layout: Layout[], pageWise: PageWise): string => {
  const {
    title,
    description,
    keywords,
    canonical,
    image,
    color,
    "background-color": backgroundColor,
    "font-size": fontSize,
    "font-family": fontFamily,
    "line-height": lineHeight,
    iconUrl,
  } = pageWise;
  return minify(
    "<!DOCTYPE html>" +
      `<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || "Generated Page"}</title>
  ${
    title
      ? `<meta property="og:title" content="${title}">
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="${title}">`
      : ""
  }
${
  description
    ? `<meta name="description" content="${description}">
      <meta property="og:description" content="${description}">
      <meta property="twitter:description" content="${description}">`
    : ""
}
${keywords ? `<meta name="keywords" content="${keywords}">` : ""}
${
  canonical
    ? `<link rel="canonical" href="${canonical}">
        <meta property="og:url" content="${canonical}" />`
    : ""
}
  ${
    image
      ? `
        <meta property="og:image" content="${image}" />
        <meta name="twitter:image" content="${image}">
        `
      : ""
  }
  ${iconUrl ? `<link rel="icon" href="${iconUrl}">` : ""}
<style>
${getCssReset()}
  body {
    color: ${color || "#ffffff"};
    background-color: ${backgroundColor || "#000000"};
    font-size: ${fontSize || "16px"};
    font-family: ${fontFamily || "inherit"};
    line-height: ${lineHeight || "1.5"};
    height: 100%;
    width:100%;
    overflow:auto;
  }
  html {
    height:100%;
    width:100%
  }  
</style>
${
  hasType(layout, "icon")
    ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">'
    : ""
}

</head>
<body>
${renderLayout(layout)}
</body>
</html>`
  );
};

const getCssReset = () => {
  return `*,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    box-sizing: border-box;
    border: 0 solid;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  button {
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    background-color: inherit;
  }
  a {
    display:inline-block;
    color: inherit;
    text-decoration: inherit;
    width:100%;
    height:100%;
  }
  i {
    cursor:pointer
  }
  .flex {
    display:flex;
    align-items:center;
    width:100%;
    height:100%;
  }  
  .inlineblock {
    display:inline-block
  }
  `;
};

// Convert layout array to HTML
const renderLayout = (items: Layout[]): string => {
  const layout = items
    .map((item) => {
      const { type, props } = item;
      const child = props.child;
      const renderedType =
        type === "image"
          ? "img"
          : type === "container" ||
            type === "text" ||
            type === "row" ||
            type === "column"
          ? "div"
          : type === "divider"
          ? "hr"
          : type === "icon"
          ? "i"
          : type;

      const styleDivider = (style: Style) => {
        const { width, height, ...rest } = style;
        return [{ width, height }, rest];
      };

      const [widthAndHeight, rest] = styleDivider(props.style);
      const widthAndHeightGenerated = styleGenerator(widthAndHeight);
      const restGenerated = styleGenerator(rest);

      const isAudioOrVideo = type === "audio" || type === "video";
      const isImage = type === "image";
      const isText = type === "text";
      const isVoidElement = type === "image" || type === "divider";

      const addButtonWrapper = (html: string) => {
        if (type === "button" || type === "icon") {
          return `
          <a href="${props.href || ""}" target=${
            props.newTab ? "_blank" : "_self"
          }
          rel="noopener noreferrer"
          >
          ${html}
          </a>`;
        } else {
          return html;
        }
      };

      const addFlexWrapper = (html: string) => {
        return `<div class="inlineblock" style="${widthAndHeightGenerated}"><div class="flex">${html}</div></div>`;
      };

      const rendered = `<${renderedType} style="${restGenerated}; width:100%; height:100%" ${
        isAudioOrVideo ? "controls" : ""
      }  ${
        isImage
          ? `src="${props.src || ""}"
            alt="${props.alt || ""}"`
          : ""
      } 
      ${props.iconType ? `class="bi bi-${props.iconType}"` : ""}
      ${isVoidElement ? "/" : ""}>
        ${
          isAudioOrVideo
            ? `
          <source src="${props.src || ""}"/>
          Your browser does not support this tag.
          `
            : ""
        }
          ${isText ? props.text || "" : ""}
          ${child ? renderLayout(child) : ""}

        ${!isVoidElement ? `</${renderedType}>` : ""}
        `;

      const buttonWrapperApplied = addButtonWrapper(rendered);
      const FlexWrapperApplied = addFlexWrapper(buttonWrapperApplied);
      return FlexWrapperApplied;
    })
    .join("");
  return layout;
};
