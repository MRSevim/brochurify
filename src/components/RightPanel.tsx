import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { selectActive, useAppSelector } from "@/redux/hooks";
import PageSettings from "./Settings/PageSettings/PageSettings";
import ElementSettings from "./Settings/ElementSettings";

const RightPanel = () => {
  const [toggle] = SettingsToggleContext.Use();

  return (
    <PanelWrapper toggle={toggle} from="right">
      <RightPanelInner />
    </PanelWrapper>
  );
};

const RightPanelInner = () => {
  const active = useAppSelector(selectActive);
  return (
    <div className="overflow-y-auto max-h-screen-header-excluded p-2 min-h-full gutter-stable">
      {active && <ElementSettings />}
      {!active && <PageSettings />}
    </div>
  );
};

export default RightPanel;
