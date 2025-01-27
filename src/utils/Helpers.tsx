import Button from "@/components/BuilderComponents/Button";
import { Layout, Props, Style, EditorState, PageWise } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";
import Row from "@/components/BuilderComponents/Row";
import { findElementById } from "./EditorHelpers";
import { UseSelector } from "react-redux";
import Image from "@/components/BuilderComponents/Image";

export const componentList = {
  button: (props: Props) => <Button {...props} />,
  column: (props: Props) => <Column {...props} />,
  text: (props: Props) => <Text {...props} />,
  row: (props: Props) => <Row {...props} />,
  image: (props: Props) => <Image {...props} />,
};

export const getDefaultStyle = (type: string): Style => {
  if (type === "button") {
    return {
      backgroundColor: "#d8cdcb",
      ...getDefaultStyle(""),
    };
  }
  if (type === "pageWise") {
    return {
      margin: "12px 12px 12px 12px",
      padding: "0px 0px 0px 0px",
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
      style: getDefaultStyle(""),
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
      style: getDefaultStyle(""),
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
      style: getDefaultStyle(""),
      width: 400,
      height: 400,
      src: "https://archive.org/download/placeholder-image/placeholder-image.jpg",
    };
  }
  return {};
};

export const saveToLocalStorage = (key: string, param: Layout[] | PageWise) => {
  // Convert the state.layout to a JSON string
  const val = JSON.stringify(param);

  localStorage.setItem(key, val);
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
export const getProp = (
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

    return element?.props?.[type] as string | number; // Accessing the dynamic property safely
  });
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
