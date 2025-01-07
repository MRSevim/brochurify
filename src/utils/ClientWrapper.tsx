"use client";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutToggleContext.Provider>
      <SettingsToggleContext.Provider>
        {children}
      </SettingsToggleContext.Provider>
    </LayoutToggleContext.Provider>
  );
}
