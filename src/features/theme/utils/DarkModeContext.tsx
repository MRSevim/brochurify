"use client";
import { setCookie } from "@/utils/Helpers";
import {
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  createContext,
  useEffect,
} from "react";

type LigthMode = [boolean, Dispatch<SetStateAction<boolean>>];

const ligthMode = createContext<LigthMode | null>(null);

export const useLightMode = (): LigthMode => {
  const context = useContext(ligthMode);
  if (!context) {
    throw new Error("useLightMode must be used within a ligthModeProvider");
  }
  return context;
};

export const Provider = ({
  children,
  lightModeFromCookie,
}: {
  children: React.ReactNode;
  lightModeFromCookie: boolean;
}) => {
  const [lightMode, setLightMode] = useState(lightModeFromCookie || false);

  useEffect(() => {
    if (!lightMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    setCookie("lightMode", `${lightMode}`, 1000);
  }, [lightMode]);

  return (
    <ligthMode.Provider value={[lightMode, setLightMode]}>
      {children}
    </ligthMode.Provider>
  );
};
