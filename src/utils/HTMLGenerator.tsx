import { hasType } from "./EditorHelpers";
import { getUsedFonts } from "./getUsedFonts";
import { mapOverFonts } from "./GoogleFonts";
import {
  fullStylesWithIdsGenerator,
  getCssReset,
  styleGenerator,
  variablesGenerator,
} from "./StyleGenerators";
import { Layout, PageWise, Variable } from "./Types";
import { html as beautifyHtml } from "js-beautify";

export const generateHTML = (
  layout: Layout[],
  pageWise: PageWise,
  variables: Variable[]
): string => {
  const { title, description, keywords, canonical, image, iconUrl, ...rest } =
    pageWise;

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
  const fonts = getUsedFonts(layout, pageWise);
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
      ${updateInternalLinks(renderedBody)}
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
                : type === "button"
                  ? "a"
                  : type;

      const isAudioOrVideo = type === "audio" || type === "video";
      const isImage = type === "image";
      const isText = type === "text";
      const isFixed = type === "fixed";
      const isVoidElement = type === "image" || type === "divider";

      const addFlexWrapper = (html: string) => {
        return `<div class="block ${isFixed ? "" : "relative"}" id="idwrapper${
          item.id
        }"><div class="flex wAndHFull center" ${
          item.props.anchorId ? `id="user-${item.props.anchorId}"` : ""
        }>${html}</div></div>`;
      };

      const rendered = `<${renderedType} ${
        renderedType === "a"
          ? `href="${props.href}" target=${
              props.newTab ? "_blank" : "_self"
            } rel="noopener noreferrer"`
          : ""
      } id="id${item.id}" ${
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

      const FlexWrapperApplied = addFlexWrapper(rendered);
      return FlexWrapperApplied;
    })
    .join("");
  return layout;
};

const updateInternalLinks = (html: string): string => {
  return html.replace(
    /<a([^>]*?)\s+href=(['"])#([^'"]+)\2([^>]*)>/gi,
    (match, preAttrs, quote, anchor, postAttrs) => {
      const targetId = `user-${anchor}`;
      const hrefAttr = `href=${quote}#${targetId}${quote}`;
      const onclickAttr = `onclick="event.preventDefault(); document.getElementById('${targetId}')?.scrollIntoView({ behavior: 'smooth' });"`;

      // Avoid duplicating onclick if already exists
      if (/onclick\s*=/.test(match)) return match;

      return `<a${preAttrs} ${hrefAttr} ${onclickAttr}${postAttrs}>`;
    }
  );
};
