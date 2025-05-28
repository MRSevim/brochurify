import { hasType } from "./EditorHelpers";
import { mapOverFonts } from "./GoogleFonts";
import { getUsedFontsFromHTML } from "./Helpers";
import {
  fullStylesWithIdsGenerator,
  getStyleResets,
  styleGenerator,
  variablesGenerator,
} from "./StyleGenerators";
import { Layout, PageWise, Variable } from "./Types";
import { html as beautifyHtml } from "js-beautify";

export const generateHTML = (
  layout: Layout[],
  pageWise: PageWise,
  variables: Variable[],
  preview: boolean
): string => {
  const { title, description, keywords, canonical, image, iconUrl, ...rest } =
    pageWise;

  if (preview) {
    delete (rest as { overflow?: any }).overflow;
  }

  const renderedBody = renderLayout(layout);
  const fullstylesWithIds =
    fullStylesWithIdsGenerator(layout, false) +
    fullStylesWithIdsGenerator(layout, true);
  const variablesString = variablesGenerator(variables);

  const baseHTMLHead = `<meta charset="UTF-8">
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
      hasType(layout, "icon")
        ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">'
        : ""
    }`;
  const observerScript = `<script>   
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
    </script>`;
  const additionalStyles = `<style>
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
    </style>`;

  const tempHTML = `<!DOCTYPE html>
      <html lang="en">
      <head>
      ${baseHTMLHead}
      ${observerScript}
      ${additionalStyles}
      </head>
      <body>
      ${renderedBody}
      </body>
      </html>`;

  const fonts = getUsedFontsFromHTML(tempHTML);
  const fontLinks = mapOverFonts(fonts);
  const finalHTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
  ${fontLinks}
  ${baseHTMLHead}
  ${observerScript}
  ${additionalStyles}
  </head>
  <body>
  ${renderedBody}
  </body>
  </html>`;

  return beautifyHtml(finalHTML, {
    indent_size: 2,
    indent_char: " ",
    preserve_newlines: true,
    max_preserve_newlines: 0,
    wrap_line_length: 0,
    inline: [], // prevents collapsing inline tags like <span>, <a>, etc.
    content_unformatted: [], // don't mess with inline content
  });
};

const getCssReset = (pageWise: PageWise) => {
  return `*,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    margin: 0;
    padding: 0;
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
  }  
  .block {
    display:block;
  }
  .wAndHFull {
    width:100%;
    height:100%;
  }   
  .relative {
    position:relative
  }   
${getStyleResets(pageWise)}
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

      const isAudioOrVideo = type === "audio" || type === "video";
      const isImage = type === "image";
      const isText = type === "text";
      const isFixed = type === "fixed";
      const isVoidElement = type === "image" || type === "divider";
      const href = props.href?.startsWith("#")
        ? `#user-${props.href.slice(1)}`
        : props.href;

      const formatOnClick = (href?: string) => {
        if (href?.startsWith("#")) {
          const targetId = `user-${href.slice(1)}`;
          return `event.preventDefault(); document.getElementById('${targetId}')?.scrollIntoView({ behavior: 'smooth' });`;
        }
        return "";
      };
      const onclick = formatOnClick(props.href);

      const addButtonWrapper = (html: string) => {
        if (type === "button") {
          return `
          <a class="wAndHFull flex" ${href ? `href=${href}` : ""}" ${
            onclick ? `onclick="${onclick}"` : ""
          } target=${
            props.newTab ? "_blank" : "_self"
          }rel="noopener noreferrer">${html}</a>`;
        } else {
          return html;
        }
      };

      const addFlexWrapper = (html: string) => {
        return `<div class="block ${isFixed ? "" : "relative"}" id="idwrapper${
          item.id
        }"><div class="flex wAndHFull" ${
          item.props.anchorId ? `id="user-${item.props.anchorId}"` : ""
        }>${html}</div></div>`;
      };

      const rendered = `<${renderedType} id="id${item.id}" ${
        isAudioOrVideo ? "controls" : ""
      }class="element wAndHFull ${
        props.iconType ? `bi bi-${props.iconType}` : ""
      }
      "${
        isImage
          ? `src="${props.src || ""}"
            alt="${props.alt || ""}"`
          : ""
      }>
        ${
          isAudioOrVideo
            ? `
          <source src="${
            props.src || ""
          }">Your browser does not support this tag.`
            : ""
        }${isText ? props.text || "" : ""}${child ? renderLayout(child) : ""}${
        !isVoidElement ? `</${renderedType}>` : ""
      }`;

      const buttonWrapperApplied = addButtonWrapper(rendered);
      const FlexWrapperApplied = addFlexWrapper(buttonWrapperApplied);
      return FlexWrapperApplied;
    })
    .join("");
  return layout;
};
