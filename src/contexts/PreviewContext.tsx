"use client";
import {
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  createContext,
  useEffect,
} from "react";
import { LayoutToggleContext, SettingsToggleContext } from "./ToggleContext";

type Preview = [boolean, Dispatch<SetStateAction<boolean>>];

const previewContext = createContext<Preview | null>(null);

export const usePreview = (): Preview => {
  const context = useContext(previewContext);
  if (!context) {
    throw new Error("usePreview must be used within a previewProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [preview, setPreview] = useState(false);
  const [_, setLayoutToggle] = LayoutToggleContext.Use();
  const [__, setSettingsToggle] = SettingsToggleContext.Use();

  useEffect(() => {
    if (preview) {
      setLayoutToggle(false);
      setSettingsToggle(false);
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";
  }, [preview]);

  return (
    <previewContext.Provider value={[preview, setPreview]}>
      {children}
    </previewContext.Provider>
  );
};
