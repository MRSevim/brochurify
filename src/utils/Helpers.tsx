import Button from "@/components/BuilderComponents/Button";
import { Props, PropsWithNodeChildren } from "./Types";
import Column from "@/components/BuilderComponents/Column";
import Text from "@/components/BuilderComponents/Text";
import { v4 as uuidv4 } from "uuid";

export const componentList = {
  button: (props: Props) => <Button {...props} />,
  column: (props: PropsWithNodeChildren) => <Column {...props} />,
  text: (props: Props) => <Text {...props} />,
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
      children: {
        id: uuidv4(),
        type: "text",
        props: getDefaultElementProps("text"),
      },
    };
  }
  return {};
};
