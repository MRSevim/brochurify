"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { makeStore, AppStore } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { Provider as LightModeProvider } from "@/contexts/DarkModeContext";
import { Provider as ViewModeProvider } from "@/contexts/ViewModeContext";
import { Provider as PreviewProvider } from "@/contexts/PreviewContext";
import { Provider as ZoomProvider } from "@/contexts/ZoomContext";
import { Provider as AddSectionToggleProvider } from "@/contexts/AddSectionToggleContext";
import { Provider as UserProvider } from "@/contexts/UserContext";
import { Provider as SubscribePopupProvider } from "@/contexts/SubscribePopupContext";
import { EditorRefProvider } from "@/contexts/EditorRefContext";
import { Provider as PublishPopupProvider } from "@/contexts/PublishPopupContext";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { PaddleEnv, User } from "./Types";
import { useSyncUser } from "./hooks/useSyncUser";
import { useServerInsertedHTML } from "next/navigation";
import { initializePaddle } from "@paddle/paddle-js";

export default function ClientWrapper({
  children,
  lightMode,
  UserFromCookie,
}: {
  children: React.ReactNode;
  lightMode: boolean;
  UserFromCookie: User;
}) {
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        <PublishPopupProvider>
          <LightModeProvider lightModeFromCookie={lightMode}>
            <ViewModeProvider>
              <PreviewProvider>
                <ZoomProvider>
                  <UserProvider UserFromCookie={UserFromCookie}>
                    <SubscribePopupProvider>
                      <AddSectionToggleProvider>
                        <EditorRefProvider>
                          <InnerWrapper>{children}</InnerWrapper>
                        </EditorRefProvider>
                      </AddSectionToggleProvider>
                    </SubscribePopupProvider>
                  </UserProvider>
                </ZoomProvider>
              </PreviewProvider>
            </ViewModeProvider>
          </LightModeProvider>
        </PublishPopupProvider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}

const InnerWrapper = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as PaddleEnv,
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      ...(process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? {
            pwCustomer: {},
          }
        : {}),
    });
  }, []);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  useSyncUser();
  return <Provider store={storeRef.current}>{children}</Provider>;
};

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
