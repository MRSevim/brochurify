"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/features/builder/utils/contexts/ToggleContext";
import { makeStore, AppStore } from "@/lib/redux/store";
import { useRef, useState } from "react";
import { Provider } from "react-redux";
import { Provider as LightModeProvider } from "@/features/theme/utils/DarkModeContext";
import { Provider as ViewModeProvider } from "@/features/builder/utils/contexts/ViewModeContext";
import { Provider as PreviewProvider } from "@/features/builder/utils/contexts/PreviewContext";
import { Provider as ZoomProvider } from "@/features/builder/utils/contexts/ZoomContext";
import { Provider as AddSectionToggleProvider } from "@/features/builder/utils/contexts/AddSectionToggleContext";
import { Provider as UserProvider } from "@/features/auth/utils/contexts/UserContext";
import { Provider as SubscribePopupProvider } from "@/utils/contexts/SubscribePopupContext";
import { EditorRefProvider } from "@/features/builder/utils/contexts/EditorRefContext";
import { Provider as PublishPopupProvider } from "@/features/builder/utils/contexts/PublishPopupContext";
import { Provider as PaddleContextProvider } from "@/features/auth/utils/contexts/PaddleContext";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { User } from "./Types";
import { useSyncUser } from "../features/auth/utils/useSyncUser";
import { useServerInsertedHTML } from "next/navigation";

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
              <ZoomProvider>
                <UserProvider UserFromCookie={UserFromCookie}>
                  <PaddleContextProvider>
                    <SubscribePopupProvider>
                      <AddSectionToggleProvider>
                        <EditorRefProvider>
                          <InnerWrapper>
                            <PreviewProvider>{children}</PreviewProvider>
                          </InnerWrapper>
                        </EditorRefProvider>
                      </AddSectionToggleProvider>
                    </SubscribePopupProvider>
                  </PaddleContextProvider>
                </UserProvider>
              </ZoomProvider>
            </ViewModeProvider>
          </LightModeProvider>
        </PublishPopupProvider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}

const InnerWrapper = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);

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
