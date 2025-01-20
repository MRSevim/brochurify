import Button from "@/components/BuilderComponents/Button";
import { Layout, Props, Where } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";
import Row from "@/components/BuilderComponents/Row";
import { DragEvent } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  handleCenterDragOver,
  handleCenterDrop,
  handleDragLeave,
  handleSideDragOver,
  handleSideDrop,
} from "@/redux/slices/editorSlice";

export const componentList = {
  button: (props: Props) => <Button {...props} />,
  column: (props: Props) => <Column {...props} />,
  text: (props: Props) => <Text {...props} />,
  row: (props: Props) => <Row {...props} />,
};

export const getDefaultElementProps = (type: string): Props => {
  if (!type) {
    throw Error("Please pass a type to getDefaultElementProps func");
  }
  if (type === "button") {
    return {
      text: "Click me",
    };
  } else if (type === "text") {
    return {
      text: "I am a text",
    };
  } else if (type === "column") {
    return {
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

export const saveCookie = (param: Layout[]) => {
  // Convert the state.layout to a JSON string
  const layout = JSON.stringify(param);

  // Set the expiration date for 1 year from now
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  const expires = date.toUTCString();

  // Create the cookie string
  document.cookie = `layout=${encodeURIComponent(
    layout
  )}; expires=${expires}; path=/;`;
};

export const handleSideDropCaller = (
  e: DragEvent<HTMLElement>,
  dispatch: ReturnType<typeof useAppDispatch>,
  id: string
) => {
  e.preventDefault();
  dispatch(handleSideDrop(id));
};
export const handleCenterDropCaller = (
  e: DragEvent<HTMLElement>,
  dispatch: ReturnType<typeof useAppDispatch>,
  id: string
) => {
  e.preventDefault();
  dispatch(handleCenterDrop(id));
};
export const handleSideDragOverCaller = ({
  e,
  id,
  where,
  dispatch,
}: {
  id: string;
  e: DragEvent<HTMLElement>;
  where: Where;
  dispatch: ReturnType<typeof useAppDispatch>;
}) => {
  e.preventDefault();
  dispatch(handleSideDragOver({ addLocation: { id, where } }));
};
export const handleCenterDragOverCaller = (
  e: DragEvent<HTMLElement>,
  id: string,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  e.preventDefault();
  dispatch(handleCenterDragOver(id));
};
export const handleDragLeaveCaller = (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  dispatch(handleDragLeave());
};
