"use client";
import { createContext, useContext, useState, SetStateAction } from "react";

const createToggleContext = () => {
  const ToggleStateContext = createContext<boolean | undefined>(undefined);
  const ToggleSetterContext = createContext<
    React.Dispatch<SetStateAction<boolean>> | undefined
  >(undefined);

  const useToggle = () => {
    const value = useContext(ToggleStateContext);
    if (value === undefined)
      throw new Error("useToggle must be used inside provider");
    return value;
  };

  const useSetToggle = () => {
    const setter = useContext(ToggleSetterContext);
    if (!setter) throw new Error("useSetToggle Must be used inside provider");
    return setter;
  };

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [toggle, setToggle] = useState(false);

    return (
      <ToggleStateContext.Provider value={toggle}>
        <ToggleSetterContext.Provider value={setToggle}>
          {children}
        </ToggleSetterContext.Provider>
      </ToggleStateContext.Provider>
    );
  };

  return { useToggle, useSetToggle, Provider };
};

export const LayoutToggleContext = createToggleContext();
export const SettingsToggleContext = createToggleContext();
