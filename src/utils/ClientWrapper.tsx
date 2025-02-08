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
      const layout = localStorage.getItem("layout");
      const pageWise = localStorage.getItem("pageWise");
      if (layout) {
        const layoutParsed = JSON.parse(layout);
        if (pageWise) {
          const pageWiseParsed = JSON.parse(pageWise);
          storeRef.current.dispatch(
            hydrate({ layout: layoutParsed, pageWise: pageWiseParsed })
          );
        } else {
          storeRef.current.dispatch(
            hydrate({ layout: layoutParsed, pageWise: undefined })
          );
        }
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
