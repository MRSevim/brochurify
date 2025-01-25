import { useAppSelector } from "@/redux/hooks";
import { SizingType } from "@/utils/Types";
import { createContext, useContext } from "react";
import { getSetting, getValueFromShorthandStr } from "@/utils/Helpers";

const ShorthandSettingWrapperContext = createContext<{
  value: string;
}>({ value: "" });

export const useSetting = () => useContext(ShorthandSettingWrapperContext);

const ShorthandSettingWrapper = ({
  children,
  type,
  i,
}: {
  children: React.ReactNode;
  type: string;
  i?: number;
}) => {
  const variable = getSetting(useAppSelector, type);

  const value = i
    ? getValueFromShorthandStr(variable, i)
    : getValueFromShorthandStr(variable, 0);

  return (
    <ShorthandSettingWrapperContext.Provider value={{ value: value }}>
      {children}
    </ShorthandSettingWrapperContext.Provider>
  );
};

export default ShorthandSettingWrapper;
