import { Layout, PageWise, Style, Variable, StringOrUnd } from "./Types";

const layoutKeys: (keyof Style)[] = [
  "width",
  "height",
  "max-width",
  "max-height",
  "min-width",
  "min-height",
  "top",
  "left",
  "bottom",
  "right",
  "position",
];

function splitStyleRecursive(style: Style): [Style, Style] {
  const first: Style = {};
  const second: Style = {};

  for (const key in style) {
    if (key === "transition") {
      // Skip transition inside nested objects, only split at root
      second.transition = style.transition;
      continue;
    }

    const value = style[key];
    if (typeof value === "object" && value !== null) {
      // Nested Style object — recurse
      const [firstPart, secondPart] = splitStyleRecursive(value as Style);
      if (Object.keys(firstPart).length > 0) {
        first[key] = firstPart;
      }
      if (Object.keys(secondPart).length > 0) {
        second[key] = secondPart;
      }
    } else {
      // Primitive string or undefined value
      if (layoutKeys.includes(key as keyof Style)) {
        first[key] = value as StringOrUnd;
      } else {
        second[key] = value as StringOrUnd;
      }
    }
  }

  return [first, second];
}

export function styleDivider(style: Style): [Style, Style] {
  const first: Style = {};
  const second: Style = {};

  // Handle root-level transition splitting
  if (style.transition) {
    const parts = style.transition.split(",");
    const layoutParts: string[] = [];
    const otherParts: string[] = [];

    for (const part of parts) {
      const propName = part.trim().split(/\s+/)[0] as keyof Style;
      if (layoutKeys.includes(propName)) {
        layoutParts.push(part.trim());
      } else {
        otherParts.push(part.trim());
      }
    }

    if (layoutParts.length) first.transition = layoutParts.join(", ");
    if (otherParts.length) second.transition = otherParts.join(", ");
  }

  // Exclude transition for recursive splitting
  const { transition, ...restStyle } = style;

  const [firstPart, secondPart] = splitStyleRecursive(restStyle);

  Object.assign(first, firstPart);
  Object.assign(second, secondPart);

  return [first, second];
}

export const getRest = (style: Style): string => {
  const [, rest] = styleDivider(style);

  return styleGenerator(rest);
};
export const getWrapperStyles = (style: Style, type: string): string => {
  const [wrapperStyles, rest] = styleDivider(style);
  const extraStyles: Partial<Style> =
    type === "container" ? { margin: "0 auto" } : {};
  return styleGenerator({ ...wrapperStyles, ...extraStyles });
};

// Recursive style generator function
export const styleGenerator = (style: Style): string => {
  const baseEntries: [string, any][] = [];
  const containerEntries: [string, any][] = [];

  for (const [key, value] of Object.entries(style || {})) {
    if (key.startsWith("@container")) {
      containerEntries.push([key, value]);
    } else {
      baseEntries.push([key, value]);
    }
  }

  const generate = (entries: [string, any][]) =>
    entries
      .map(([key, value]) => {
        const bgColor = style["background-color"];
        if (typeof value === "object") {
          // Handle nested styles
          const nested = styleGenerator(value);
          return `${key} { ${nested} }`;
        } else {
          if (!value || !key) return "";
          if (key === "background-image" && bgColor) {
            return `${key}: linear-gradient(${bgColor}), ${value};`;
          }
          return `${key}: ${value};`;
        }
      })
      .join("\n");

  // Generate base styles first, then container queries last
  return [generate(baseEntries), generate(containerEntries)]
    .filter(Boolean)
    .join("\n");
};

export const fullStylesWithIdsGenerator = (
  layout: Layout[],
  rest: boolean
): string => {
  return layout
    .map((item) => {
      const child = item.props.child;
      const style = item.props.style;
      const isFixed = item.type === "fixed";
      const styleStr = rest
        ? getRest(style)
        : getWrapperStyles(style, item.type);

      const fixedStyles =
        isFixed && rest ? getWrapperStyles(style, item.type) : "";

      // Combine all styles for this selector
      const combinedStyles = [styleStr, fixedStyles].filter(Boolean).join(" ");

      // Skip if combinedStyles is empty
      if (!combinedStyles.trim()) {
        return child ? fullStylesWithIdsGenerator(child, rest) : "";
      }

      // Construct CSS block
      return `#id${rest ? "" : "wrapper"}${item.id} { ${combinedStyles} } ${
        child ? fullStylesWithIdsGenerator(child, rest) : ""
      }`;
    })
    .join("\n");
};

export const variablesGenerator = (variables: Variable[]): string => {
  const cssVariables = variables
    .map((v) => `--${v.id}: ${v.value};`)
    .join("\n");

  return cssVariables;
};

export const getStyleResets = (pageWise: PageWise) => {
  return `  /*Blockquote*/
  blockquote {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 30px;
    padding-left: 15px;
    border-left: 3px solid ${pageWise.color};
  }
  /*ul-ol*/
  ul,
  ol {
    list-style-position: inside;
  }
  ul li p,
  ol li p {
    display: inline;
  }
  /*hr*/
  hr {
    border-top: 1px solid ${pageWise.color};
  }
  /*table*/
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
  }
  th {
    background-color: ${pageWise.color};
  }
  th,
  td {
    padding: 5px;
  }`;
};
