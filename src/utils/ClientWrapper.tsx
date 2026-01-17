"use client";
import { makeStore, AppStore } from "@/lib/redux/store";
import { useRef, useState } from "react";
import { Provider } from "react-redux";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { useSyncUser } from "../features/auth/utils/useSyncUser";
import { useServerInsertedHTML } from "next/navigation";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/features/builder/utils/contexts/ToggleContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  /*   useSyncUser(); */

  return <Provider store={storeRef.current}>{children}</Provider>;
}

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}

export const ToggleContexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        {children}
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
};
