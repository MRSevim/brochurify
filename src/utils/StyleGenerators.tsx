import { CONFIG } from "./Helpers";
import { Layout, Style, Variable } from "./Types";

export const styleDivider = (style: Style) => {
  const tabletContainerQueryKey =
    CONFIG.possibleOuterTypes.tabletContainerQuery;
  const mobileContainerQueryKey =
    CONFIG.possibleOuterTypes.mobileContainerQuery;

  const {
    width,
    height,
    position,
    top,
    left,
    bottom,
    right,
    [tabletContainerQueryKey]: tabletStyles = {},
    [mobileContainerQueryKey]: mobileStyles = {},
    ...rest
  } = style;

  // Extract width & height from tabletStyles, rest goes to restTabletStyles
  const {
    width: tabletWidth,
    height: tabletHeight,
    ...restTabletStyles
  } = tabletStyles;

  // Extract width & height from mobileStyles, rest goes to restMobileStyles
  const {
    width: mobileWidth,
    height: mobileHeight,
    ...restMobileStyles
  } = mobileStyles;

  const result = [
    {
      width,
      height,
      position,
      top,
      left,
      bottom,
      right,
      ...(tabletWidth || tabletHeight
        ? {
            [tabletContainerQueryKey]: {
              width: tabletWidth,
              height: tabletHeight,
            },
          }
        : {}),
      ...(mobileWidth || mobileHeight
        ? {
            [mobileContainerQueryKey]: {
              width: mobileWidth,
              height: mobileHeight,
            },
          }
        : {}),
    },
    {
      ...rest,
      ...(Object.keys(restTabletStyles).length
        ? { [tabletContainerQueryKey]: restTabletStyles }
        : {}),
      ...(Object.keys(restMobileStyles).length
        ? { [mobileContainerQueryKey]: restMobileStyles }
        : {}),
    },
  ];

  return result;
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
