import Button from "@/components/BuilderComponents/Button";
import { LayoutOrUnd, Layout, Props, Where, Style } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";
import Row from "@/components/BuilderComponents/Row";

export const componentList = {
  button: (props: Props) => <Button {...props} />,
  column: (props: Props) => <Column {...props} />,
  text: (props: Props) => <Text {...props} />,
  row: (props: Props) => <Row {...props} />,
};

const getDefaultStyle = (type: string): Style => {
  if (type === "button") {
    return {
      backgroundColor: "#d8cdcb",
      ...getDefaultStyle(""),
    };
  }
  return {
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "10px",
    paddingTop: "10px",
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    marginTop: "10px",
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
  }
  return {};
};

export const saveToLocalStorage = (param: Layout[]) => {
  // Convert the state.layout to a JSON string
  const layout = JSON.stringify(param);

  localStorage.setItem("layout", layout);
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
