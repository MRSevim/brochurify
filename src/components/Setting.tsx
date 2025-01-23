import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { findElementById } from "@/utils/EditorHelpers";
import { SizingType, Style } from "@/utils/Types";

import { ChangeEvent, createContext, useContext } from "react";
import { changeElementStyle } from "@/redux/slices/editorSlice";

const SettingContext = createContext<{
  value: string;
  onChange: (e: any) => void;
}>({ onChange: () => {}, value: "" });

export const useSetting = () => useContext(SettingContext);

const Setting = ({
  children,
  type,
  sizingTypeArray,
}: {
  children: React.ReactNode;
  type: string;
  sizingTypeArray?: SizingType[];
}) => {
  const dispatch = useAppDispatch();
  const typeExtended =
    type === "padding" || type === "margin" ? type + "Left" : type;

  const variable = useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;

    const element = findElementById(layout, activeId || "");
    const style = element?.props?.style as Style; // Dynamically typed style object

    return style?.[typeExtended]; // Accessing the dynamic property safely
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dispatchFunc = (type: string) => {
      dispatch(
        changeElementStyle({
          type,
          newValue: e.target.value + "px",
        })
      );
    };
    if (type === "padding" || type === "margin") {
      sizingTypeArray?.forEach((item) => dispatchFunc(item.type));
    } else {
      dispatchFunc(type);
    }
  };
  return (
    <SettingContext.Provider value={{ value: variable || "10", onChange }}>
      {children}
    </SettingContext.Provider>
  );
};

export default Setting;
