import Button from "@/components/BuilderComponents/Button";
import { Props, Style, EditorState, PropsWithId, PageWise } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";
import Row from "@/components/BuilderComponents/Row";
import { findElementById } from "./EditorHelpers";
import { UseSelector } from "react-redux";
import Image from "@/components/BuilderComponents/Image";
import Audio from "@/components/BuilderComponents/Audio";
import Video from "@/components/BuilderComponents/Video";

export const componentList = {
  button: (props: PropsWithId) => <Button {...props} />,
  column: (props: PropsWithId) => <Column {...props} />,
  text: (props: PropsWithId) => <Text {...props} />,
  row: (props: PropsWithId) => <Row {...props} />,
  image: (props: PropsWithId) => <Image {...props} />,
  audio: (props: PropsWithId) => <Audio {...props} />,
  video: (props: PropsWithId) => <Video {...props} />,
};

export const getPageWise = (): PageWise => {
  return {
    color: "#000000",
    backgroundColor: "#ffffff",
    fontSize: "16px",
    fontFamily: "inherit",
    lineHeight: "1.5",
  };
};

export const getDefaultStyle = (type: string): Style => {
  if (type === "button") {
    return {
      backgroundColor: "#d8cdcb",
      ...getDefaultStyle(""),
    };
  } else if (type === "row") {
    return {
      display: "flex",
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
  } else if (type === "no-space") {
    return {
      margin: "0px 0px 0px 0px",
      padding: "0px 0px 0px 0px",
    };
  } else if (type === "column") {
    return {
      margin: "0px 10px 0px 10px",
      padding: "10px 10px 10px 10px",
    };
  }
  return {
    margin: "10px 10px 10px 10px",
    padding: "10px 10px 10px 10px",
  };
};

export const getDefaultElementProps = (type: string): Props => {
  if (!type) {
    throw Error("Please pass a type to getDefaultElementProps func");
  }
  if (type === "button") {
    return {
      style: getDefaultStyle("button"),
      child: [
        {
          id: uuidv4(),
          type: "text",
          props: getDefaultElementProps("text"),
        },
      ],
    };
  } else if (type === "text") {
    return {
      style: getDefaultStyle(""),
      text: "I am a text",
    };
  } else if (type === "column") {
    return {
      style: getDefaultStyle("column"),
      child: [
        {
          id: uuidv4(),
          type: "text",
          props: getDefaultElementProps("text"),
        },
      ],
    };
  } else if (type === "row") {
    return {
      style: getDefaultStyle("row"),
      child: [
        {
          id: uuidv4(),
          type: "column",
          props: getDefaultElementProps("column"),
        },
        {
          id: uuidv4(),
          type: "column",
          props: getDefaultElementProps("column"),
        },
      ],
    };
  } else if (type === "image") {
    return {
      style: getDefaultStyle("image"),
      src: "/placeholder-image.jpg",
    };
  } else if (type === "audio") {
    return {
      style: getDefaultStyle("no-space"),
      src: "",
    };
  } else if (type === "video") {
    return {
      style: getDefaultStyle("video"),
      src: "",
    };
  }
  return {};
};

export const saveToLocalStorage = (param: EditorState) => {
  // Convert the state.layout to a JSON string
  const val = JSON.stringify(param);

  localStorage.setItem("editor", val);
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getSetting = (
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
  type: string
) => {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;
    if (!activeId) {
      return state.editor.pageWise?.[type];
    }

    const element = findElementById(layout, activeId);
    const style = element?.props?.style as Style; // Dynamically typed style object

    return style?.[type]; // Accessing the dynamic property safely
  });
};
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
  return useAppSelector((state) => state.editor.variables)
    .filter((item) => item.type === "font-family")
    .map((item) => ({ title: item.name, value: item.value }));
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

export function setCookie(cname: String, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
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
