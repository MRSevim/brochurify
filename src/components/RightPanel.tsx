import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppSelector } from "@/redux/hooks";
import PageSettings from "./Settings/PageSettings/PageSettings";
import ElementSettings from "./Settings/ElementSettings";

const RightPanel = () => {
  const [toggle] = SettingsToggleContext.Use();
  const active = useAppSelector((state) => state.editor.active);
  return (
    <PanelWrapper toggle={toggle} from="right">
      <div className="overflow-y-auto max-h-screen-header-excluded p-2 min-h-full gutter-stable">
        {active && <ElementSettings />}
        {!active && <PageSettings />}
      </div>
    </PanelWrapper>
  );
};

export default RightPanel;
