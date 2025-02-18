import { Layout, PageWise, Style } from "./Types";
export const generateHTML = (layout: Layout[], pageWise: PageWise): string => {
  const {
    title,
    description,
    keywords,
    canonical,
    image,
    color,
    backgroundColor,
    fontSize,
    fontFamily,
    lineHeight,
  } = pageWise;

  return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="twitter:card" content="summary_large_image" />
              <title>${title || "Generated Page"}</title>
               ${
                 title
                   ? `<meta property="og:title" content="${description}">
                      <meta property="twitter:title" content="${description}">`
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
              <style>
              ${getCssReset()}
                body {
                  color: ${color || "#ffffff"}
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
            </head>
            <body>
              ${renderLayout(layout)}
            </body>
            </html>`;
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
    color: inherit;
    text-decoration: inherit;
  }
  i {
    cursor:pointer
  }
  .flex {
    display:flex;
    width:100%;
    height:100%;
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
          : type;

      const camelToKebab = (str: string) =>
        str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

      const styleDivider = (style: Style) => {
        const { width, height, ...rest } = style;
        return [{ width, height }, rest];
      };
      const styleGenerator = (style: Style) => {
        return Object.entries(style || {})
          .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
          .join(" ");
      };
      const [widthAndHeight, rest] = styleDivider(props.style);
      const widthAndHeightGenerated = styleGenerator(widthAndHeight);
      const restGenerated = styleGenerator(rest);

      const isAudioOrVideo = type === "audio" || type === "video";
      const isImage = type === "image";
      const isText = type === "text";

      const addButtonWrapper = (html: string) => {
        if (type === "button") {
          return `
          <a href=${props.href || ""} target=${
            props.newTab ? "_blank" : "_self"
          }>
          ${html}
          </a>`;
        } else {
          return html;
        }
      };

      const addFlexWrapper = (html: string) => {
        return `<div style="${widthAndHeightGenerated}"><div class="flex">${html}</div></div>`;
      };

      const rendered = `<${renderedType} style="${restGenerated}; width:100%; height:100%"  ${
        isAudioOrVideo ? "controls" : ""
      }  ${
        isImage
          ? `src=${props.src || ""}
            alt=${props.alt || ""}`
          : ""
      }>
        ${
          isAudioOrVideo
            ? `
          <source src=${props.src || ""}></source>
          Your browser does not support this tag.
          `
            : ""
        }
          ${isText ? props.text || "" : ""}
          ${child ? renderLayout(child) : ""}
        </${renderedType}>`;

      const buttonWrapperApplied = addButtonWrapper(rendered);
      const FlexWrapperApplied = addFlexWrapper(buttonWrapperApplied);
      return FlexWrapperApplied;
    })
    .join("");
  return layout;
};
