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
import { Provider as ViewModeProvider } from "@/contexts/ViewModeContext";
import { Provider as PreviewProvider } from "@/contexts/PreviewContext";
import { Provider as ZoomProvider } from "@/contexts/ZoomContext";
import { Provider as AddSectionToggleProvider } from "@/contexts/AddSectionToggleContext";
import { Provider as UserProvider } from "@/contexts/UserContext";
import { EditorRefProvider } from "@/contexts/EditorRefContext";
import { StyleSheetManager } from "styled-components";
import { User } from "./Types";

export default function ClientWrapper({
  children,
  lightMode,
  UserFromCookie,
}: {
  children: React.ReactNode;
  lightMode: boolean;
  UserFromCookie: User;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) =>
        prop !== "styles" && prop !== "variables" && prop !== "pageWise"
      }
    >
      <LayoutToggleContext.Provider>
        <SettingsToggleContext.Provider>
          <LightModeProvider lightModeFromCookie={lightMode}>
            <ViewModeProvider>
              <PreviewProvider>
                <ZoomProvider>
                  <UserProvider UserFromCookie={UserFromCookie}>
                    <AddSectionToggleProvider>
                      <EditorRefProvider>
                        <Provider store={storeRef.current}>{children}</Provider>
                      </EditorRefProvider>
                    </AddSectionToggleProvider>
                  </UserProvider>
                </ZoomProvider>
              </PreviewProvider>
            </ViewModeProvider>
          </LightModeProvider>
        </SettingsToggleContext.Provider>
      </LayoutToggleContext.Provider>
    </StyleSheetManager>
  );
}
