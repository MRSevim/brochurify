"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { hydrate } from "@/redux/slices/editorSlice";
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import { Provider as LightModeProvider } from "@/contexts/DarkModeContext";

export default function ClientWrapper({
  children,
  lightMode,
}: {
  children: React.ReactNode;
  lightMode: boolean;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (typeof window !== "undefined") {
      const editorState = localStorage.getItem("editor");
      if (editorState) {
        const editorStateParsed = JSON.parse(editorState);
        storeRef.current.dispatch(hydrate(editorStateParsed));
      }
    }
  }
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        <LightModeProvider lightModeFromCookie={lightMode}>
          <Provider store={storeRef.current}>{children}</Provider>
        </LightModeProvider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}
