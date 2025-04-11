import { SettingsToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { selectActive, useAppSelector } from "@/redux/hooks";
import PageSettings from "./Settings/PageSettings/PageSettings";
import ElementSettings from "./Settings/ElementSettings";
import SmallText from "./SmallText";

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
  const draggedItem = useAppSelector((state) => state.editor.draggedItem);

  return (
    <div className="overflow-y-auto p-2 min-h-full gutter-stable">
      {draggedItem ? (
        <div className="mt-8 text-center">
          <SmallText>
            Stop dragging to see the available pagewise and element settings
          </SmallText>
        </div>
      ) : (
        <>
          {active && <ElementSettings />}
          {!active && <PageSettings />}
        </>
      )}
    </div>
  );
};

export default RightPanel;
