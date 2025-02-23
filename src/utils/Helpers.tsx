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
        return `${key}: ${value};`;
      }
    })
    .join(" ");
};

export const styledElements = {
  styledDiv: styled.div<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)};
  `,
  styledAudio: styled.audio<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
  `,
  styledButton: styled.button<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
  `,
  styledHr: styled.hr<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
  `,
  styledI: styled.i<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
  `,
  styledImg: styled.img<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
  `,
  styledVideo: styled.video<{ styles: Style }>`
    ${({ styles }) => styleGenerator(styles)}
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
    "font-family": "inherit",
    "line-height": "1.5",
    height: "100%",
    width: "100%",
    overflow: "auto",
    iconUrl: "",
  };
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
      margin: "0px 0px 0px 0px",
      padding: "10px 10px 10px 10px",
    };
  } else if (type === "container") {
    return {
      "max-width": "1300px",
      margin: "0 auto",
      padding: "0 12px",
      height: "100%",
      width: "100%",
    };
  } else if (type === "icon") {
    return {
      "font-size": "25px",
      "text-align": "center",
      ...getDefaultStyle("no-space"),
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

/*getSetting overloads*/
export function getSetting(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: "&:hover" | "&:active",
  innerType: string
): Style | undefined;

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
      return state.editor.pageWise?.[type];
    }

    const element = findElementById(layout, activeId);

    const style = element?.props.style as Style;

    if (type === "&:hover" || type === "&:active") {
      if (innerType) {
        return style?.[type]?.[innerType];
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
    .map((item) => ({ title: item.name, value: item.value }));
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
};

export const fontOptions = [
  "inherit",
  "Arial ,sans-serif",
  "Verdana ,sans-serif",
  "Tahoma ,sans-serif",
  "Trebuchet MS ,sans-serif",
  "Times New Roman ,serif",
  "Georgia ,serif",
  "Garamond ,serif",
  "Courier New ,monospace",
  "Brush Script MT ,cursive",
];
