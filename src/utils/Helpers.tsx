import Button from "@/components/BuilderComponents/Button";
import {
  Props,
  Style,
  EditorState,
  PropsWithId,
  PageWise,
  Layout,
  StringOrUnd,
} from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";
import Row from "@/components/BuilderComponents/Row";
import { findElementById } from "./EditorHelpers";
import { UseSelector } from "react-redux";
import Image from "@/components/BuilderComponents/Image";
import Audio from "@/components/BuilderComponents/Audio";
import Video from "@/components/BuilderComponents/Video";
import Container from "@/components/BuilderComponents/Container";
import Divider from "@/components/BuilderComponents/Divider";
import Icon from "@/components/BuilderComponents/Icon";
import { selectVariables } from "@/redux/hooks";
import styled from "styled-components";
import {
  getAllKeyFrames,
  getRest,
  getWrapperStyles,
  styleGenerator,
} from "./StyleGenerators";
import Fixed from "@/components/BuilderComponents/Fixed";
import { googleFontOptions } from "./GoogleFonts";

export const runIntersectionObserver = (elem: HTMLElement | undefined) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        entry.target.classList.add("scrolled");
        observer.unobserve(entry.target); // Stops observing after adding class
      });
  });
  if (!elem) {
    document.querySelectorAll(".element").forEach((elem) => {
      observer.observe(elem);
    });
  } else {
    observer.observe(elem);
  }

  return observer;
};

export const styledElements = {
  styledEditor: styled.div<{ styles: PageWise }>`
    ${({ styles }) => {
      const { overflow, ...rest } = styles;
      const style = styleGenerator(rest);
      const allKeyframes = getAllKeyFrames();
      return style + allKeyframes;
    }};
  `,
  styledComponentWrapperDiv: styled.div<{ styles: Style }>`
    ${({ styles }) => getWrapperStyles(styles)};
  `,
  styledDiv: styled.div<{ styles: Style }>`
    ${({ styles }) => getRest(styles)};
  `,
  styledFixed: styled.div<{ styles: Style }>`
    ${({ styles }) => getRest(styles)};
  `,
  styledAudio: styled.audio<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
  styledButton: styled.button<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
  styledHr: styled.hr<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
  styledI: styled.i<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
  styledImg: styled.img<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
  styledVideo: styled.video<{ styles: Style }>`
    ${({ styles }) => getRest(styles)}
  `,
};

export const componentList = {
  button: (props: PropsWithId) => <Button {...props} />,
  column: (props: PropsWithId) => <Column {...props} />,
  text: (props: PropsWithId) => <Text {...props} />,
  row: (props: PropsWithId) => <Row {...props} />,
  image: (props: PropsWithId) => <Image {...props} />,
  audio: (props: PropsWithId) => <Audio {...props} />,
  video: (props: PropsWithId) => <Video {...props} />,
  container: (props: PropsWithId) => <Container {...props} />,
  divider: (props: PropsWithId) => <Divider {...props} />,
  icon: (props: PropsWithId) => <Icon {...props} />,
  fixed: (props: PropsWithId) => <Fixed {...props} />,
};

export const getPageWise = (): PageWise => {
  return {
    title: "",
    description: "",
    keywords: "",
    canonical: "",
    image: "",
    color: "#000000",
    "background-color": "#ffffff",
    "font-size": "16px",
    height: "100vh",
    overflow: "auto",
    position: "relative",
    "font-family": "initial",
    "line-height": "1.5",
    iconUrl: "",
    "container-type": "size",
    h1: { "font-size": "2.5em" },
    h2: { "font-size": "2em" },
    h3: { "font-size": "1.5em" },
    "h1,h2,h3": { "font-family": "inherit" },
  };
};
export const detectTag = (tag: string, htmlStr: string) => {
  const regex = new RegExp(`<${tag}\\b`, "i"); // Case-insensitive match for opening tag
  return regex.test(htmlStr);
};
export const getDefaultStyle = (type: string): Style => {
  if (type === "row") {
    return {
      display: "flex",
      "flex-wrap": "wrap",
      width: "100%",
      ...getDefaultStyle(""),
    };
  } else if (type === "image") {
    return {
      width: "200px",
      height: "200px",
      ...getDefaultStyle("no-space"),
    };
  } else if (type === "video") {
    return {
      width: "300px",
      height: "200px",
      ...getDefaultStyle("no-space"),
    };
  } else if (type === "audio") {
    return {
      width: "300px",
      height: "56px",
      ...getDefaultStyle("no-space"),
    };
  } else if (type === "no-space") {
    return {
      margin: "0px 0px 0px 0px",
      padding: "0px 0px 0px 0px",
    };
  } else if (type === "column") {
    return {
      display: "flex",
      width: "50%",
      "flex-direction": "column",
      margin: "0px 0px 0px 0px",
      padding: "10px 10px 10px 10px",
    };
  } else if (type === "container") {
    return {
      display: "flex",
      "flex-direction": "column",
      "max-width": "1300px",
      margin: "0 auto",
      padding: "0 12px",
    };
  } else if (type === "icon") {
    return {
      "font-size": "25px",
      "text-align": "center",
      ...getDefaultStyle("no-space"),
    };
  } else if (type === "fixed") {
    return {
      display: "flex",
      "flex-direction": "column",
      position: "absolute",
      width: "auto",
      height: "auto",
      top: "0px",
      left: "0px",
      ...getDefaultStyle("no-space"),
    };
  } else if (type === "button") {
    return {
      display: "flex",
      "flex-direction": "column",
      ...getDefaultStyle(""),
    };
  }
  return {
    margin: "10px 10px 10px 10px",
    padding: "10px 10px 10px 10px",
  };
};

export const generateLayoutItem = (type: string): Layout => {
  return {
    id: uuidv4(),
    type,
    props: getDefaultElementProps(type),
  };
};

export const getDefaultElementProps = (type: string): Props => {
  if (!type) {
    throw Error("Please pass a type to getDefaultElementProps func");
  }
  if (type === "button") {
    return {
      style: getDefaultStyle("button"),
      child: [generateLayoutItem("text")],
    };
  } else if (type === "text") {
    return {
      style: getDefaultStyle(""),
      text: "I am a text",
    };
  } else if (type === "column") {
    return {
      style: getDefaultStyle("column"),
      child: [generateLayoutItem("text")],
    };
  } else if (type === "row") {
    return {
      style: getDefaultStyle("row"),
      child: [generateLayoutItem("column"), generateLayoutItem("column")],
    };
  } else if (type === "image") {
    return {
      style: getDefaultStyle("image"),
      src: CONFIG.placeholderImgUrl,
    };
  } else if (type === "audio") {
    return {
      style: getDefaultStyle("audio"),
      src: "",
    };
  } else if (type === "video") {
    return {
      style: getDefaultStyle("video"),
      src: "",
    };
  } else if (type === "container") {
    return {
      style: getDefaultStyle("container"),
      child: [generateLayoutItem("text")],
    };
  } else if (type === "divider") {
    return {
      style: getDefaultStyle(""),
    };
  } else if (type === "icon") {
    return {
      iconType: "1-circle-fill",
      style: getDefaultStyle("icon"),
    };
  } else if (type === "fixed") {
    return {
      style: getDefaultStyle("fixed"),
      child: [generateLayoutItem("icon")],
    };
  }
  return { style: {} };
};

export const saveToLocalStorage = (param: EditorState) => {
  // Convert the state.layout to a JSON string
  const stripped = {
    layout: param.layout,
    pageWise: param.pageWise,
    variables: param.variables,
    history: param.history,
  };
  const val = JSON.stringify(stripped);

  localStorage.setItem("editor", val);
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getUnit = (value: string | undefined) => {
  if (!value) return;
  const match = value.match(/[\d.\-+]*\s*(.*)/);
  return match ? match[1] : "";
};

/*getSetting overloads*/
export function getSetting(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: PossibleOuterTypes,
  innerType: string
): StringOrUnd;

export function getSetting(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: string,
  innerType?: string
): StringOrUnd;

export function getSetting(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: string,
  innerType?: string
) {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;

    if (!activeId) {
      if (innerType) {
        return (state.editor.pageWise?.[type] as Style)?.[innerType];
      }
      return state.editor.pageWise?.[type];
    }

    const element = findElementById(layout, activeId);

    const style = element?.props.style as Style;
    if (possibleOuterTypesArr.includes(type as PossibleOuterTypes)) {
      if (innerType) {
        return (style?.[type] as Style)?.[innerType];
      }
      return undefined;
    }

    return style?.[type];
  });
}

export const getProp = <T extends unknown>(
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
  type: string
) => {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;
    if (!activeId) throw Error("no activeId in getProp");

    const element = findElementById(layout, activeId);

    return element?.props?.[type] as T; // Accessing the dynamic property safely
  });
};

export const getFontVariables = (
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>
) => {
  return useAppSelector(selectVariables)
    .filter((item) => item.type === "font-family")
    .map((item) => ({ id: item.id, title: item.name, value: item.value }));
};

export const makeArraySplitFromCommas = (str: string | undefined): string[] => {
  if (str) {
    return str.split(",").map((item) => item.trim());
  } else return [];
};

export const addAnimationToString = (
  str: string,
  animation: string
): string => {
  if (!str) {
    return animation;
  } else
    return [...str.split(",").map((str) => str.trim()), animation].join(", ");
};

export const updateOrDeleteAnimationAtIndex = (
  str: string,
  animation: string | undefined,
  i: number,
  deletion: boolean
) => {
  const animations = str.split(",").map((str) => str.trim());

  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i");
    // Handle edge cases like undefined or invalid index
  }
  if (i >= animations.length) {
    throw Error("Index higher than split array's length"); // Index out of range
  }

  if (deletion) {
    animations.splice(i, 1); // Remove the animation at the specified index
  } else if (animation) {
    animations[i] = animation; // Replace the animation at the given index
  }
  return animations.join(", "); // Return updated string
};

export const getValueFromShorthandStr = (
  str: string | undefined,
  i: number | undefined
) => {
  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i");
    // Handle edge cases like undefined or invalid index
  }

  const values = str.split(" "); // Split the shorthand string into individual values
  if (i >= values.length) {
    throw Error("Index higher than string values' length"); // Index out of range
  }

  return values[i];
};

export const setValueFromShorthandStr = (
  str: string | undefined,
  i: number | undefined,
  newValue: string
) => {
  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i"); // Handle edge cases like undefined or invalid index
  }

  const values = str.split(" "); // Split the shorthand string into individual values
  if (i >= values.length) {
    throw Error("Index higher than string values' length"); // Index out of range
  }

  values[i] = newValue; // Replace the value at the specified index

  return values.join(" "); // Recombine the values into a shorthand string
};
export const extractUrlValue = (cssUrl: string): string => {
  const match = cssUrl.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : "";
};

export function setCookie(cname: String, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const CONFIG = {
  placeholderImgUrl: "/placeholder-image.jpg",
  possibleOuterTypes: {
    active: "&:active",
    scrolled: "&.scrolled",
    hover: "&:hover",
    tabletContainerQuery: "@container (max-width: 768px)",
    mobileContainerQuery: "@container (max-width: 360px)",
  },
} as const;
const possibleOuterTypesArr = [...Object.values(CONFIG.possibleOuterTypes)];

type PossibleOuterTypes = (typeof possibleOuterTypesArr)[number];

export const systemFontOptions = [
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

export function getUsedFontsFromHTML(html: string): string[] {
  const fontSet = new Set<string>();
  const dom = new DOMParser().parseFromString(html, "text/html");

  // Matches only the first font name (quoted or unquoted)
  const fontRegex = /font-family\s*:\s*(['"][^'"]+['"]|[^,;]+)/gi;

  const validFontTitles = new Set(googleFontOptions.map((f) => f.title));

  const cleanFont = (fontValue: string) =>
    fontValue.trim().replace(/^['"]|['"]$/g, ""); // remove surrounding quotes

  // 1. Check <style> tags
  const styleTags = dom.querySelectorAll("style");
  styleTags.forEach((style) => {
    const css = style.textContent || "";
    let match;
    while ((match = fontRegex.exec(css)) !== null) {
      const font = cleanFont(match[1]);
      if (validFontTitles.has(font)) fontSet.add(font);
    }
  });

  // 2. Check inline style attributes
  const allElements = dom.querySelectorAll("*[style]");
  allElements.forEach((el) => {
    const styleAttr = el.getAttribute("style") || "";
    let match;
    while ((match = fontRegex.exec(styleAttr)) !== null) {
      const font = cleanFont(match[1]);
      if (validFontTitles.has(font)) fontSet.add(font);
    }
  });

  return Array.from(fontSet);
}
