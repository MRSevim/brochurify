import { Layout, PageWise, Style } from "@/features/builder/utils/types.d";

export const googleFontOptions = [
  { title: "Roboto", value: "'Roboto', sans-serif" },
  { title: "EB Garamond", value: "'EB Garamond', serif" },
  { title: "Dancing Script", value: "'Dancing Script', cursive" },
  { title: "Inter", value: "'Inter', sans-serif" },
  { title: "Space Mono", value: "'Space Mono', monospace" },
  { title: "Merriweather", value: "'Merriweather', serif" },
  { title: "Lobster", value: "'Lobster', cursive" },
  { title: "Courier Prime", value: "'Courier Prime', monospace" },
];

const systemFontOptions = [
  { title: "Default", value: "initial" },
  { title: "Arial", value: "'Arial', sans-serif" },
  { title: "Verdana", value: "'Verdana', sans-serif" },
  { title: "Tahoma", value: "'Tahoma', sans-serif" },
  { title: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { title: "Times New Roman", value: "'Times New Roman', serif" },
  { title: "Georgia", value: "'Georgia', serif" },
  { title: "Garamond", value: "'Garamond', serif" },
  { title: "Courier New", value: "'Courier New', monospace" },
  { title: "Brush Script MT", value: "'Brush Script MT', cursive" },
];
export const fontOptions = [...systemFontOptions, ...googleFontOptions];

export const defaultInheritFontOptions = [
  ...systemFontOptions.map((option) => {
    if (option.value === "initial") return { ...option, value: "inherit" };
    return option;
  }),
  ...googleFontOptions,
];

export const mapOverFonts = (fonts: string[], keyed = false) => {
  const getHref = (font: string) =>
    `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+",
    )}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;

  if (!keyed) {
    return fonts
      .map(
        (font) => `
      <link
      href="${getHref(font)}"
           rel="stylesheet"/>
           `,
      )
      .join("\n");
  }
  return fonts.map((font) => (
    <link key={font} href={getHref(font)} rel="stylesheet" />
  ));
};

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
  //Use jsdom on the server
  if (typeof window === "undefined") {
    const { JSDOM } = require("jsdom"); // Only loaded on server
    const dom = new JSDOM(`<!DOCTYPE html><p>${html}</p>`);
    const elements = dom.window.document.querySelectorAll("[style]");

    elements.forEach((el: HTMLElement) => {
      if (el instanceof dom.window.HTMLElement) {
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
