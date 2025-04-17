"use client";
import {
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  createContext,
} from "react";

type Zoom = [number, Dispatch<SetStateAction<number>>];

const zoomContext = createContext<Zoom | null>(null);

export const useZoom = (): Zoom => {
  const context = useContext(zoomContext);
  if (!context) {
    throw new Error("useZoom must be used within a zoomProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState(0);

  return (
    <zoomContext.Provider value={[zoom, setZoom]}>
      {children}
    </zoomContext.Provider>
  );
};
