import { Layout, Style } from "./Types";

// Recursive style generator function
export const styleGenerator = (style: Style): string => {
  return Object.entries(style || {})
    .map(([key, value]) => {
      if (typeof value === "object") {
        // Handle nested style objects
        const nestedStyles = styleGenerator(value);
        return `${key} { ${nestedStyles} }`;
      } else {
        // Handle regular CSS properties
        if (!value) return "";
        return `${key}: ${value};`;
      }
    })
    .join(" ");
};

export const fullStylesWithIdsGenerator = (layout: Layout[]): string => {
  return layout
    .map((item) => {
      const child = item.props.child;
      const styleStr = styleGenerator(item.props.style);
      return `#id${item.id} { ${styleStr}; width:100%; height:100% } ${
        child ? fullStylesWithIdsGenerator(child) : ""
      }`;
    })
    .join("\n");
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
