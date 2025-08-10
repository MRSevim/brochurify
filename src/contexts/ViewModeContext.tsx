"use client";
import { SetStateAction, useContext, useState, createContext } from "react";

const VieModeStateContext = createContext<string | undefined>(undefined);
const VieModeSetterContext = createContext<
  React.Dispatch<SetStateAction<string>> | undefined
>(undefined);

export const useViewModeState = () => {
  const context = useContext(VieModeStateContext);
  if (!context) {
    throw new Error("useViewModeState must be used within a viewModeProvider");
  }
  return context;
};

export const useViewModeSetter = () => {
  const context = useContext(VieModeSetterContext);
  if (!context) {
    throw new Error("useViewModeSetter must be used within a viewModeProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState("desktop");

  return (
    <VieModeStateContext.Provider value={viewMode}>
      <VieModeSetterContext.Provider value={setViewMode}>
        {children}
      </VieModeSetterContext.Provider>
    </VieModeStateContext.Provider>
  );
};
