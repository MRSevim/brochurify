import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { findElementById } from "@/utils/EditorHelpers";
import Error from "./Error";
import { Style } from "@/utils/Types";

import { ChangeEvent, createContext, useContext } from "react";
import { changeElementStyle } from "@/redux/slices/editorSlice";

const SettingContext = createContext<{
  value: string;
  onChange: (e: any) => void;
  type: string;
}>({ onChange: () => {}, value: "", type: "" });

export const useSetting = () => useContext(SettingContext);

const Setting = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => {
  const dispatch = useAppDispatch();
  const variable = useAppSelector((state) => {
    const layout = state.editor.layout;
    const activeId = state.editor.active?.id;

    const element = findElementById(layout, activeId || "");
    const style = element?.props?.style as Style; // Dynamically typed style object

    return style?.[type]; // Accessing the dynamic property safely
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      changeElementStyle({
        type,
        newValue: e.target.value + "px",
      })
    );
  if (!variable) return <Error />;
  return (
    <SettingContext.Provider value={{ value: variable, onChange, type }}>
      {children}
    </SettingContext.Provider>
  );
};

export default Setting;
