import { Layout, PageWise, Style } from "./Types";
import { googleFontOptions } from "./GoogleFonts";
const validFontTitles = new Set(googleFontOptions.map((f) => f.title));

const cleanFont = (font: string) => {
  const [first] = font.trim().split(",");
  return first.trim().replace(/^['"]|['"]$/g, "");
};

function extractFontsFromStyle(style: Style | undefined, fontSet: Set<string>) {
  if (!style) return;

  for (const key in style) {
    const value = style[key];

    // Case: direct font-family
    if (key === "fontFamily" && typeof value === "string") {
      const clean = cleanFont(value);
      if (validFontTitles.has(clean)) {
        fontSet.add(clean);
      }
    }

    // Case: nested styles
    if (typeof value === "object" && value !== null) {
      extractFontsFromStyle(value as Style, fontSet);
    }
  }
}
function extractFontsFromTextHTML(html: string, fontSet: Set<string>) {
  if (typeof window === "undefined") {
    const { JSDOM } = require("jsdom"); // Only loaded on server}
    const dom = new JSDOM(`<!DOCTYPE html><p>${html}</p>`);
    const elements = dom.window.document.querySelectorAll("[style]");

    elements.forEach((el: HTMLElement) => {
      if (el instanceof dom.window.HTMLElement) {
        const fontFamily = el.style?.fontFamily;
        if (fontFamily) {
          const font = cleanFont(fontFamily);
          console.log(font);
          if (validFontTitles.has(font)) {
            fontSet.add(font);
          }
        }
      }
    });
  }

  // CSR: Use native DOMParser
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
    const elements = doc.querySelectorAll("[style]");

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const fontFamily = el.style?.fontFamily;
        if (fontFamily) {
          const font = cleanFont(fontFamily);
          if (validFontTitles.has(font)) {
            fontSet.add(font);
          }
        }
      }
    });
  }
}

export function getUsedFonts(layout: Layout[], pageWise: PageWise): string[] {
  const fontSet = new Set<string>();

  // ✅ Step 1: Extract from layout
  const traverseLayout = (items: Layout[]) => {
    for (const item of items) {
      extractFontsFromStyle(item.props?.style, fontSet);
      if (item.type === "text" && typeof item.props?.text === "string") {
        extractFontsFromTextHTML(item.props.text, fontSet);
      }
      if (item.props?.child?.length) {
        traverseLayout(item.props.child);
      }
    }
  };
  traverseLayout(layout);

  // ✅ Step 2: Extract from pageWise styles
  for (const key in pageWise) {
    const val = pageWise[key];
    if (typeof val === "string" && key === "font-family") {
      const font = cleanFont(val);
      if (validFontTitles.has(font)) fontSet.add(font);
    }
    if (typeof val === "object" && val !== null) {
      extractFontsFromStyle(val as Style, fontSet);
    }
  }

  return Array.from(fontSet);
}
