"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export type VisibilitySet = Set<string>;

const VisibilitySetStateContext = createContext<VisibilitySet | undefined>(
  undefined,
);
const VisibilitySetSetterContext = createContext<
  Dispatch<SetStateAction<VisibilitySet>> | undefined
>(undefined);

export const useVisibilitySetState = () => {
  const context = useContext(VisibilitySetStateContext);
  if (context === undefined) {
    throw new Error(
      "useVisibilitySetState must be used within VisibilitySetProvider",
    );
  }
  return context;
};

export const useVisibilitySetSetter = () => {
  const context = useContext(VisibilitySetSetterContext);
  if (context === undefined) {
    throw new Error(
      "useVisibilitySetSetter must be used within VisibilitySetProvider",
    );
  }
  return context;
};

export const VisibilitySetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visibilitySet, setVisibilitySet] = useState<VisibilitySet>(new Set());

  return (
    <VisibilitySetStateContext.Provider value={visibilitySet}>
      <VisibilitySetSetterContext.Provider value={setVisibilitySet}>
        {children}
      </VisibilitySetSetterContext.Provider>
    </VisibilitySetStateContext.Provider>
  );
};
