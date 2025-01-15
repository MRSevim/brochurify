"use client";
import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";

const RightPanel = () => {
  const [toggle] = SettingsToggleContext.Use();

  return (
    <PanelWrapper toggle={toggle} from="right">
      Settings
    </PanelWrapper>
  );
};

export default RightPanel;
