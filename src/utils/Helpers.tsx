import {
  Props,
  Style,
  EditorState,
  PageWise,
  Layout,
  OptionsObject,
  CONFIG,
  Variable,
  User,
} from "./Types";
import { v4 as uuidv4 } from "uuid";
import { findElementById } from "./EditorHelpers";
import { UseSelector } from "react-redux";
import { selectVariables } from "@/redux/hooks";
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

export const getPageWise = (): PageWise => {
  return {
    title: "",
    description: "",
    keywords: "",
    canonical: "",
    image: "",
    color: "#000000",
    "background-color": "#ffffff80",
    "font-size": "16px",
    height: "100vh",
    overflow: "auto",
    "font-family": "initial",
    "line-height": "1.5",
    iconUrl: "",
    googleAnalyticsTag: "",
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
      style: getDefaultStyle("text"),
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

export const stripEditorFields = (
  param: EditorState | Partial<EditorState>
) => {
  const stripped = {
    layout: param.layout,
    pageWise: param.pageWise,
    variables: param.variables,
  };
  return stripped;
};

export const saveToLocalStorage = (param: EditorState) => {
  // Convert the state.layout to a JSON string
  const stripped = stripEditorFields(param);
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

export function getSetting<T = string>(
  useAppSelector: UseSelector<{ editor: EditorState }>,
  type: string | undefined,
  ...innerTypes: (string | undefined)[]
): T {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;

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
      (k): k is string => k !== undefined
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
  type: string
) => {
  return useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;
    if (!activeId) throw Error("no activeId in getProp func");

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

export const makeArraySplitFrom = (
  str: string | undefined,
  splitValue: string
): string[] => {
  if (!str) return [];

  const result: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of str) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    }

    if (char === splitValue && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current.trim());
  }

  return result;
};

export const addToString = (
  str: string,
  newVal: string,
  splitValue: string
): string => {
  if (!str) {
    return newVal;
  } else {
    const arr = makeArraySplitFrom(str, splitValue);
    return [...arr.map((str) => str.trim()), newVal].join(splitValue);
  }
};

export const updateOrDeleteAtIndex = (
  str: string,
  newVal: string | undefined,
  i: number,
  deletion: boolean,
  splitValue: string
) => {
  const arr = makeArraySplitFrom(str, splitValue);

  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i");
    // Handle edge cases like undefined or invalid index
  }
  if (i >= arr.length) {
    throw Error("Index higher than split array's length"); // Index out of range
  }

  if (deletion) {
    arr.splice(i, 1); // Remove at the specified index
  } else if (newVal) {
    arr[i] = newVal; // Replace at the given index
  }
  return arr.join(splitValue); // Return updated string
};

export const getValueFromShorthandStr = (
  str: string | undefined,
  i: number | undefined
) => {
  if (!str || i === undefined || i < 0) {
    return "";
  }

  const values = str.split(" "); // Split the shorthand string into individual values
  if (i >= values.length) {
    return "";
  }

  return values[i];
};

const findInVariables = (str: string, variables: Variable[]) => {
  const idMatch = str.match(/var\(--(.+?)\)/);
  const id = idMatch?.[1];
  const variable = variables.find((variable) => variable.id === id);
  return variable?.name || str;
};

export const convertVarIdToVarName = (
  str: string,
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>
) => {
  const variables = useAppSelector(selectVariables);

  if (str.startsWith("var(--")) {
    return findInVariables(str, variables);
  } else {
    return str;
  }
};

export const convertVarIdsToVarNames = (
  arr: string[],
  useAppSelector: UseSelector<{
    editor: EditorState;
  }>
): string[] => {
  const variables = useAppSelector(selectVariables);
  return arr.map((item) => {
    if (item.startsWith("var(--")) {
      return findInVariables(item, variables);
    } else {
      return item;
    }
  });
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

export const checkSub = (user: User) => {
  if (!user) return false;
  return user?.roles?.includes("subscriber");
};

export const extractUrlValue = (cssUrl: string): string => {
  const match = cssUrl.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : "";
};

export function setCookie(
  cname: string,
  cvalue: string,
  exdays: number,
  setExpirationDate?: boolean
) {
  let cookieStr = `${cname}=${cvalue};path=/`;

  if (exdays > 0) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = d.toUTCString();
    const encoded = encodeURIComponent(expires);
    cookieStr += `;expires=${expires}`;
    if (setExpirationDate) {
      const expirationStr = `${cname}ExpirationDate=${encoded};path=/;expires=${expires}`;
      document.cookie = expirationStr;
    }
  }

  document.cookie = cookieStr;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export const formatTime = (isoString: string) => {
  const localDate = new Date(isoString);
  const formatted = localDate.toLocaleString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatted;
};

export const possibleOuterTypesArr = [
  ...Object.values(CONFIG.possibleOuterTypes),
];

export type PossibleOuterTypes = (typeof possibleOuterTypesArr)[number];

export const availableTimingFunctions: OptionsObject[] = [
  { title: "Start slow, middle fast, end slow (ease)", value: "ease" },
  { title: "Start slow, end fast (ease-in)", value: "ease-in" },
  { title: "Start fast, end slow (ease-out)", value: "ease-out" },
  {
    title: "Start slow, middle fast, end slow (ease-in-out)",
    value: "ease-in-out",
  },
  {
    title: "Linear speed",
    value: "linear",
  },
];
export const outerTypeArr = [
  { text: "onVisible", type: CONFIG.possibleOuterTypes.scrolled },
  { text: "onHover", type: CONFIG.possibleOuterTypes.hover },
  { text: "onClick", type: CONFIG.possibleOuterTypes.active },
];

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

const MAX_LABEL_LENGTH = 63;

export const addNumberWithDash = (slug: string, length: number) => {
  const suffix = length ? `-${length}` : "";
  const maxSlugLength = MAX_LABEL_LENGTH - suffix.length;

  const trimmedSlug = slug.slice(0, maxSlugLength);
  return trimmedSlug + suffix;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace all non-url-safe characters with "-"
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes
}
