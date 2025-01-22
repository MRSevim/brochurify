"use client";
import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppSelector } from "@/redux/hooks";
import PageSettings from "./PageSettings";
import ElementSettings from "./ElementSettings";

const RightPanel = () => {
  const [toggle] = SettingsToggleContext.Use();
  const active = useAppSelector((state) => state.editor.active);

  return (
    <PanelWrapper toggle={toggle} from="right">
      <section className="overflow-y-auto max-h-scrollable-container	m-2">
        {active && <ElementSettings />}
        {!active && <PageSettings />}
      </section>
    </PanelWrapper>
  );
};

export default RightPanel;
