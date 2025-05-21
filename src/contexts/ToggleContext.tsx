"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type toggleContextType = [boolean, Dispatch<SetStateAction<boolean>>];

const createToggleContext = () => {
  const toggleContext = createContext<toggleContextType | null>(null);

  const Use = (): toggleContextType => {
    const context = useContext(toggleContext);
    if (!context) {
      throw new Error("Use must be used within a toggleContextProvider");
    }
    return context;
  };

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [toggle, setToggle] = useState(false);

    return (
      <toggleContext.Provider value={[toggle, setToggle]}>
        {children}
      </toggleContext.Provider>
    );
  };

  return { Use, Provider };
};

export const LayoutToggleContext = createToggleContext();
export const SettingsToggleContext = createToggleContext();
