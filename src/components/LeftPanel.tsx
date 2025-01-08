import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";

const LeftPanel = () => {
  const [toggle] = LayoutToggleContext.Use();
  return (
    <PanelWrapper toggle={toggle} from="left">
      Layout
    </PanelWrapper>
  );
};

export default LeftPanel;
