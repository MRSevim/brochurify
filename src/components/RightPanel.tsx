import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";

const RightPanel = () => {
  const [layoutToggle] = SettingsToggleContext.Use();
  return (
    <PanelWrapper toggle={layoutToggle} from="right">
      Layout
    </PanelWrapper>
  );
};

export default RightPanel;
