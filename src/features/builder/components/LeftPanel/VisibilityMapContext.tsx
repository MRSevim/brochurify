"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export type VisibilityMap = Map<string, boolean>;

const VisibilityMapStateContext = createContext<VisibilityMap | undefined>(
  undefined
);
const VisibilityMapSetterContext = createContext<
  Dispatch<SetStateAction<VisibilityMap>> | undefined
>(undefined);

export const useVisibilityMapState = () => {
  const context = useContext(VisibilityMapStateContext);
  if (context === undefined) {
    throw new Error(
      "useVisibilityMapState must be used within VisibilityMapProvider"
    );
  }
  return context;
};

export const useVisibilityMapSetter = () => {
  const context = useContext(VisibilityMapSetterContext);
  if (context === undefined) {
    throw new Error(
      "useVisibilityMapSetter must be used within VisibilityMapProvider"
    );
  }
  return context;
};

export const VisibilityMapProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap>(new Map());

  return (
    <VisibilityMapStateContext.Provider value={visibilityMap}>
      <VisibilityMapSetterContext.Provider value={setVisibilityMap}>
        {children}
      </VisibilityMapSetterContext.Provider>
    </VisibilityMapStateContext.Provider>
  );
};
