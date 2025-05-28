import { Layout, PageWise, Style, Variable, StringOrUnd } from "./Types";

const layoutKeys: (keyof Style)[] = [
  "width",
  "height",
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
export const getWrapperStyles = (style: Style): string => {
  const [wrapperStyles, rest] = styleDivider(style);
  return styleGenerator(wrapperStyles);
};

// Recursive style generator function
export const styleGenerator = (style: Style): string => {
  return Object.entries(style || {})
    .map(([key, value]) => {
      const bgColor = style["background-color"];
      if (typeof value === "object") {
        // Handle nested style objects
        const nestedStyles = styleGenerator(value);
        return `${key} { ${nestedStyles} }`;
      } else {
        // Handle regular CSS properties
        if (!value || !key) return "";
        if (key === "background-image" && bgColor) {
          return `${key}: linear-gradient(${bgColor}), ${value};`;
        }

        return `${key}: ${value};`;
      }
    })
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
      const isContainer = item.type === "container";
      const isFixed = item.type === "fixed";
      const styleStr = rest ? getRest(style) : getWrapperStyles(style);

      const fixedStyles = isFixed && rest ? getWrapperStyles(style) : "";

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
