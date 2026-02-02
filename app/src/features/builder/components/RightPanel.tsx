import { SettingsToggleContext } from "@/features/builder/utils/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppSelector } from "@/lib/redux/hooks";
import PageSettings from "./Settings/PageSettings/PageSettings";
import ElementSettings from "./Settings/ElementSettings";
import SmallText from "../../../components/SmallText";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import {
  selectActive,
  selectPageWise,
  selectVariables,
} from "../lib/redux/selectors";

const RightPanel = () => {
  const toggle = SettingsToggleContext.useToggle();

  return (
    <PanelWrapper toggle={toggle} from="right" zIndex="20">
      <RightPanelInner />
    </PanelWrapper>
  );
};

const RightPanelInner = () => {
  const active = useAppSelector(selectActive);
  const draggedItem = useAppSelector((state) => state.editor.draggedItem);
  const variables = useAppSelector(selectVariables);
  const pageWise = useAppSelector(selectPageWise);

  return (
    <styledElements.styledWrapperDivWithVariables
      $variables={variables}
      $pageWise={pageWise}
      className="overflow-y-auto p-2 min-h-full gutter-stable"
    >
      {draggedItem ? (
        <div className="mt-8 text-center">
          <SmallText text="Stop dragging to see the available pagewise and element settings" />
        </div>
      ) : (
        <>
          {active && <ElementSettings />}
          {!active && <PageSettings />}
        </>
      )}
    </styledElements.styledWrapperDivWithVariables>
  );
};

export default RightPanel;
