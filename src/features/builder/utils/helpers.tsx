import {
  CONFIG,
  EditorState,
  PageWise,
  Style,
  Variable,
} from "./types/types.d";
import { v4 as uuidv4 } from "uuid";
import { UseSelector } from "react-redux";
import { findElementById } from "./EditorHelpers";
import { selectVariables } from "../lib/redux/selectors";
import { EditablePropKeys, Layout, LayoutTypes } from "./types/propTypes.d";

export const getMaxWidthForEditor = (viewMode: string) =>
  viewMode === "desktop"
    ? "max-w-full"
    : viewMode === "tablet"
      ? "max-w-[768px]"
      : "max-w-[360px]";

export const getPageWise = (): PageWise => {
  return {
    title: "",
    description: "",
    keywords: "",
    image: "",
    color: "#000000",
    "background-color": "#ffffff80",
    "font-size": "16px",
    height: "100vh",
    overflow: "auto",
    "font-family": "initial",
    "line-height": "1.5",
    iconUrl: "",
    "container-type": "size",
    h1: { "font-size": "2.5em" },
    h2: { "font-size": "2em" },
    h3: { "font-size": "1.5em" },
    [CONFIG.headings]: { "font-family": "inherit" },
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
      "justify-content": "center",
      "align-items": "center",
      ...getDefaultStyle(""),
    };
  } else if (type === "text") {
    return {
      "align-content": "center",
      ...getDefaultStyle(""),
    };
  }
  return {
    margin: "10px 10px 10px 10px",
    padding: "10px 10px 10px 10px",
  };
};

export const generateLayoutItem = (type: LayoutTypes): Layout => {
  return {
    id: uuidv4(),
    type,
    props: getDefaultElementProps(type),
  } as Layout;
};

export const getDefaultElementProps = (type: LayoutTypes): Layout["props"] => {
  if (type === "button") {
    return {
      style: getDefaultStyle("button"),
      child: [generateLayoutItem("text")],
      href: "",
      newTab: false,
      anchorId: "",
    };
  } else if (type === "text") {
    return {
      style: getDefaultStyle("text"),
      text: "I am a text",
      anchorId: "",
    };
  } else if (type === "column") {
    return {
      style: getDefaultStyle("column"),
      child: [generateLayoutItem("text")],
      anchorId: "",
    };
  } else if (type === "row") {
    return {
      style: getDefaultStyle("row"),
      child: [generateLayoutItem("column"), generateLayoutItem("column")],
      anchorId: "",
    };
  } else if (type === "image") {
    return {
      style: getDefaultStyle("image"),
      src: CONFIG.placeholderImgUrl,
      anchorId: "",
    };
  } else if (type === "audio") {
    return {
      style: getDefaultStyle("audio"),
      src: "",
      anchorId: "",
    };
  } else if (type === "video") {
    return {
      style: getDefaultStyle("video"),
      src: "",
      anchorId: "",
    };
  } else if (type === "container") {
    return {
      style: getDefaultStyle("container"),
      child: [generateLayoutItem("text")],
      anchorId: "",
    };
  } else if (type === "divider") {
    return {
      style: getDefaultStyle(""),
      anchorId: "",
    };
  } else if (type === "icon") {
    return {
      iconType: "1-circle-fill",
      style: getDefaultStyle("icon"),
      anchorId: "",
    };
  } else if (type === "fixed") {
    return {
      style: getDefaultStyle("fixed"),
      child: [generateLayoutItem("icon")],
      anchorId: "",
    };
  }

  throw Error("Please pass a valid type to getDefaultElementProps func");
};

export function getSetting<T = string>(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: string | undefined,
  ...innerTypes: (string | undefined)[]
): T {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active;

    const getNestedValue = (obj: any, keys: string[]): any => {
      let current = obj;
      for (const key of keys) {
        if (!current || typeof current !== "object") {
          return undefined;
        }

        current = current[key];
      }
      return current;
    };

    // Compose full path as an array: [type, ...innerTypes]
    const path = [type, ...innerTypes].filter(
      (k): k is string => k !== undefined,
    );

    if (!activeId) {
      return getNestedValue(state.editor.pageWise, path);
    }

    const element = findElementById(layout, activeId);
    const style = element?.props.style;

    return getNestedValue(style, path);
  });
}

export const getProp = <T extends unknown>(
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
  type: EditablePropKeys,
) => {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active;
    if (!activeId) throw Error("no activeId in getProp func");

    const element = findElementById(layout, activeId);

    if (!element) throw Error("No active element found!");

    if (type in element.props) {
      const activeProp = element.props[type as keyof typeof element.props];
      if (typeof activeProp === "object")
        throw Error(
          `Invalid activeProp (type:${typeof activeProp}), please use other available functions, such as getSetting, to get styles etc.`,
        );

      return (element.props as Record<string, unknown>)[type] as T; // Accessing the dynamic property safely
    } else {
      throw Error(`Invalid prop "${String(type)}" for active element`);
    }
  });
};

export const getFontVariables = (
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
) => {
  return useAppSelector(selectVariables)
    .filter((item) => item.type === "font-family")
    .map((item) => ({ id: item.id, title: item.name, value: item.value }));
};

export const findInVariables = (str: string, variables: Variable[]) => {
  const idMatch = str.match(/var\(--(.+?)\)/);
  const id = idMatch?.[1];
  const variable = variables.find((variable) => variable.id === id);
  return variable;
};

export const convertVarIdToVarName = (
  str: string,
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
) => {
  const variables = useAppSelector(selectVariables);

  if (str.startsWith("var(--")) {
    return findInVariables(str, variables)?.name;
  } else {
    return str;
  }
};

export const convertVarIdsToVars = (
  arr: string[],
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>,
) => {
  const variables = useAppSelector(selectVariables);
  return arr.map((item) => {
    if (item.startsWith("var(--")) {
      return findInVariables(item, variables);
    } else {
      return item;
    }
  });
};
