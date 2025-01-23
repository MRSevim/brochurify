"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { hydrate } from "@/redux/slices/editorSlice";
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (typeof window !== "undefined") {
      const layout = localStorage.getItem("layout");
      if (layout) {
        const layoutParsed = JSON.parse(layout);
        storeRef.current.dispatch(hydrate({ layout: layoutParsed }));
      }
    }
  }
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        <Provider store={storeRef.current}>{children}</Provider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}
