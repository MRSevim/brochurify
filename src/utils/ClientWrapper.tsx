"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        <Provider store={store}>{children}</Provider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}
