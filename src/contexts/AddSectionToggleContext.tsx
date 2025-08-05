"use client";
import {
  createContext,
  useContext,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { LayoutToggleContext } from "./ToggleContext";

const AddSectionToggleStateContext = createContext<boolean | undefined>(
  undefined
);
const AddSectionToggleSetterContext = createContext<
  React.Dispatch<SetStateAction<boolean>> | undefined
>(undefined);

export const useAddSectionToggleState = () => {
  const value = useContext(AddSectionToggleStateContext);
  if (value === undefined)
    throw new Error("useAddSectionToggle must be used inside provider");
  return value;
};

export const useAddSectionToggleSetter = () => {
  const setter = useContext(AddSectionToggleSetterContext);
  if (!setter)
    throw new Error("useAddSectionToggleSetter Must be used inside provider");
  return setter;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);
  const setLayoutToggle = LayoutToggleContext.useSetToggle();
  const layoutToggle = LayoutToggleContext.useToggle();

  useEffect(() => {
    if (toggle && !layoutToggle) setLayoutToggle(true);
  }, [toggle]);

  useEffect(() => {
    if (!layoutToggle) setToggle(false);
  }, [layoutToggle]);

  return (
    <AddSectionToggleStateContext.Provider value={toggle}>
      <AddSectionToggleSetterContext.Provider value={setToggle}>
        {children}
      </AddSectionToggleSetterContext.Provider>
    </AddSectionToggleStateContext.Provider>
  );
};
