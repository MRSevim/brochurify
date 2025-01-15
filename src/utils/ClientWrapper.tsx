"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { hydrate } from "@/redux/slices/editorSlice";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function ClientWrapper({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout: string | undefined;
}) {
  if (layout) {
    const layoutParsed = JSON.parse(layout);
    store.dispatch(hydrate({ layout: layoutParsed }));
  }

  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        <Provider store={store}>{children}</Provider>
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}
