"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { makeStore, AppStore } from "@/redux/store";
import { useRef } from "react";
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
import { StyleSheetManager } from "styled-components";
import { User } from "./Types";
import { useSyncUser } from "./hooks/useSyncUser";

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
    <StyleSheetManager
      shouldForwardProp={(prop) =>
        prop !== "styles" && prop !== "variables" && prop !== "pageWise"
      }
    >
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
    </StyleSheetManager>
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
