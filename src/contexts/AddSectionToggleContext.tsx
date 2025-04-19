"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { LayoutToggleContext } from "./ToggleContext";

type AddSectionToggle = [boolean, Dispatch<SetStateAction<boolean>>];

const AddSectionToggleContext = createContext<AddSectionToggle | null>(null);

export const useAddSectionToggle = (): AddSectionToggle => {
  const context = useContext(AddSectionToggleContext);
  if (!context) {
    throw new Error(
      "useAddSectionToggle must be used within a AddSectionToggleContextProvider"
    );
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);
  const [layoutToggle, setLayoutToggle] = LayoutToggleContext.Use();

  useEffect(() => {
    if (toggle && !layoutToggle) setLayoutToggle(true);
  }, [layoutToggle, toggle]);

  return (
    <AddSectionToggleContext.Provider value={[toggle, setToggle]}>
      {children}
    </AddSectionToggleContext.Provider>
  );
};
