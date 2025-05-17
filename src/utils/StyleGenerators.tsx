import { CONFIG, makeArraySplitFrom, PossibleOuterTypes } from "./Helpers";
import { Layout, PageWise, Style, Variable } from "./Types";

export const styleDivider = (style: Style) => {
  const layoutKeys = [
    "width",
    "height",
    "top",
    "left",
    "bottom",
    "right",
    "position",
  ];

  // Extract all known outer types
  const outerTypeKeys = Object.values(CONFIG.possibleOuterTypes);

  // Destructure outer type style objects from root
  const outerStyles: Record<string, any> = {};
  const baseStyle: Record<string, any> = {};

  for (const key in style) {
    if (outerTypeKeys.includes(key as PossibleOuterTypes)) {
      outerStyles[key] = style[key];
    } else {
      baseStyle[key] = style[key];
    }
  }

  // Divide base styles
  const first: Record<string, any> = {};
  const second: Record<string, any> = {};

  const assignTransitionParts = (
    transitionValue: string | undefined,
    target: Record<string, any>,
    fallback: Record<string, any>
  ) => {
    if (!transitionValue) return;

    const parts = makeArraySplitFrom(transitionValue, ",");
    const layoutParts: string[] = [];
    const nonLayoutParts: string[] = [];

    for (const part of parts) {
      const name = part.trim().split(/\s+/)[0]; // get property name before duration etc.
      if (layoutKeys.includes(name)) {
        layoutParts.push(part.trim());
      } else {
        nonLayoutParts.push(part.trim());
      }
    }

    if (layoutParts.length) target.transition = layoutParts.join(", ");
    if (nonLayoutParts.length) fallback.transition = nonLayoutParts.join(", ");
  };

  for (const key in baseStyle) {
    if (key === "transition") {
      assignTransitionParts(baseStyle[key], first, second);
    } else if (layoutKeys.includes(key)) {
      first[key] = baseStyle[key];
    } else {
      second[key] = baseStyle[key];
    }
  }

  // Now handle each outer type separately
  for (const key in outerStyles) {
    const styles = outerStyles[key];
    const layoutSubStyles: Record<string, any> = {};
    const restSubStyles: Record<string, any> = {};

    for (const prop in styles) {
      if (layoutKeys.includes(prop)) {
        layoutSubStyles[prop] = styles[prop];
      } else {
        restSubStyles[prop] = styles[prop];
      }
    }

    if (Object.keys(layoutSubStyles).length > 0) {
      first[key] = layoutSubStyles;
    }

    if (Object.keys(restSubStyles).length > 0) {
      second[key] = restSubStyles;
    }
  }

  return [first, second];
};

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
      return `#id${rest ? "" : "wrapper"}${item.id} { ${styleStr} ${
        rest && !isFixed
          ? `flex-grow:1;max-height:100%;${
              !isContainer ? "max-width:100%;" : ""
            }`
          : ""
      } 
      ${isFixed && rest ? getWrapperStyles(style) : ""}
      } ${child ? fullStylesWithIdsGenerator(child, rest) : ""}`;
    })
    .join("\n");
};

export const variablesGenerator = (variables: Variable[]): string => {
  const cssVariables = variables
    .map((v) => `--${v.id}: ${v.value};`)
    .join("\n");

  return cssVariables;
};

export const keyframeGenerator = (styleStr: string) => {
  // Append keyframe definitions if used in the styles
  const usedKeyframes = Object.keys(keyframes)
    .filter((kf) => styleStr.includes(kf))
    .map((kf) => keyframes[kf])
    .join("\n");
  return usedKeyframes;
};

export const getAllKeyFrames = () => {
  return Object.keys(keyframes)
    .map((kf) => keyframes[kf])
    .join("\n");
};

const keyframes: Record<string, string> = {
  slideInFromLeft: `
    @keyframes slideInFromLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInFromRight: `
    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInFromTop: `
  @keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
  }`,
  slideInFromBottom: `
  @keyframes slideInFromBottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }`,
  scaleUp: `
  @keyframes scaleUp {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }`,
  scaleDown: `
  @keyframes scaleDown {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.9);
    }
  }`,
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
