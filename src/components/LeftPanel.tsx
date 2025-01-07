import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";

const LeftPanel = () => {
  const [layoutToggle] = LayoutToggleContext.Use();
  return (
    <PanelWrapper toggle={layoutToggle} from="left">
      Layout
    </PanelWrapper>
  );
};

export default LeftPanel;
