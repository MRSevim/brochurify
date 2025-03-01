import { hasType } from "./EditorHelpers";
import { detectTag, styleDivider } from "./Helpers";
import {
  fullStylesWithIdsGenerator,
  keyframeGenerator,
  styleGenerator,
} from "./StyleGenerators";
import { Layout, PageWise, Style } from "./Types";
import { prettify } from "htmlfy";

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

  const renderedBody = renderLayout(layout);
  const fullstylesWithIds = fullStylesWithIdsGenerator(layout);
  const keyframes = keyframeGenerator(fullstylesWithIds);

  return prettify(
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
  ${
    keyframes
      ? `<script>   
    document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.classList.add("scrolled");
          observer.unobserve(entry.target);
        });
    });

    const elements = document.querySelectorAll(".element");

    elements.forEach((elem) => {
      observer.observe(elem);
    });
    });
    </script>`
      : ""
  }
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
  ${
    detectTag("blockquote", renderedBody)
      ? `blockquote {
      margin-top: 10px;
      margin-bottom: 10px;
      margin-left: 30px;
      padding-left: 15px;
      border-left: 3px solid var(--gray);
    }`
      : ""
  }
  ${
    detectTag("ul", renderedBody) || detectTag("ol", renderedBody)
      ? `ul,ol {
      list-style-position: inside;
      }
      ul li p,
      ol li p {
        display: inline;
      }`
      : ""
  }
  ${
    detectTag("hr", renderedBody)
      ? `hr {
      border-top: 1px solid var(--gray);
      }`
      : ""
  }
  ${
    detectTag("table", renderedBody)
      ? `table,
      th,
      td {
        border: 1px solid;
        border-collapse: collapse;
      }
      th {
        background-color: var(--gray);
      }
      th,
      td {
        padding: 5px;
      }`
      : ""
  }
  ${fullstylesWithIds}  
  ${keyframes}
</style>
${
  hasType(layout, "icon")
    ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">'
    : ""
}

</head>
<body>
${renderedBody}
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
    color: inherit;
    text-decoration: inherit;
  }
  i {
    cursor:pointer
  }
  .flex {
    display:flex;
    align-items:center;
  }  
  .inlineBlock {
    display:inline-block
  }
  .wAndHFull {
    width:100%;
    height:100%;
  }  
  .overflow-hidden {
    overflow:hidden;
  }  
  .relative {
    position:relative
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
            type === "column" ||
            type === "fixed"
          ? "div"
          : type === "divider"
          ? "hr"
          : type === "icon"
          ? "i"
          : type;

      const [widthAndHeight, rest] = styleDivider(props.style);
      const widthAndHeightGenerated = styleGenerator(widthAndHeight);

      const isAudioOrVideo = type === "audio" || type === "video";
      const isImage = type === "image";
      const isText = type === "text";
      const isFixed = type === "fixed";
      const isVoidElement = type === "image" || type === "divider";

      const addButtonWrapper = (html: string) => {
        if (type === "button") {
          return `
          <a class="wAndHFull inlineBlock" href="${props.href || ""}" target=${
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
        return `<div class="inlineBlock ${
          isFixed ? "" : "relative"
        }" style="${widthAndHeightGenerated}">
        <div class="flex wAndHFull">${html}</div></div>`;
      };

      const rendered = `<${renderedType} id="id${item.id}" ${
        isAudioOrVideo ? "controls" : ""
      }
      class="element 
      ${props.iconType ? `bi bi-${props.iconType}` : ""}
      "
      ${
        isImage
          ? `src="${props.src || ""}"
            alt="${props.alt || ""}"`
          : ""
      } 
     ${
       isFixed
         ? `
        style="${widthAndHeightGenerated}"
        `
         : ""
     }
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
