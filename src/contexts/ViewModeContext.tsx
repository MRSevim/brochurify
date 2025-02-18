"use client";
import {
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  createContext,
} from "react";

type ViewMode = [string, Dispatch<SetStateAction<string>>];

const viewModeContext = createContext<ViewMode | null>(null);

export const useViewMode = (): ViewMode => {
  const context = useContext(viewModeContext);
  if (!context) {
    throw new Error("useViewtMode must be used within a viewModeProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState("desktop");

  return (
    <viewModeContext.Provider value={[viewMode, setViewMode]}>
      {children}
    </viewModeContext.Provider>
  );
};
