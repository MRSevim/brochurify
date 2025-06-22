"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type PublishPopup = [boolean, Dispatch<SetStateAction<boolean>>];

const PublishPopupContext = createContext<PublishPopup | null>(null);

export const usePublishPopup = (): PublishPopup => {
  const context = useContext(PublishPopupContext);
  if (!context) {
    throw new Error(
      "usePublishPopup must be used within a publishPopupContextProvider"
    );
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <PublishPopupContext.Provider value={[toggle, setToggle]}>
      {children}
    </PublishPopupContext.Provider>
  );
};
