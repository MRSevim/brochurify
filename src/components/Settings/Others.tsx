import React from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { convertVarIdToVarName, getSetting } from "@/utils/Helpers";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import Checkbox from "../Checkbox";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Transform from "./Transform";
import Slider from "../Slider";
import ResetButton from "../ResetButton";
import { StringOrUnd, CONFIG } from "@/utils/Types";
import VariableSelector from "../VariableSelector";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

const Others = () => {
  return (
    <ToggleVisibilityWrapper title="Others">
      <OthersInner />
    </ToggleVisibilityWrapper>
  );
};

const OthersInner = () => {
  return (
    <>
      <Transform />
      <Opacity />
      <Hide />
    </>
  );
};

const Hide = () => {
  return (
    <WrapperWithBottomLine>
      <TabletOrMobile title="Hide" />
      <TabletOrMobile
        title="Hide on tablet and below"
        outerType={CONFIG.possibleOuterTypes.tabletContainerQuery}
      />
      <TabletOrMobile
        title="Hide on mobile and below"
        outerType={CONFIG.possibleOuterTypes.mobileContainerQuery}
      />
      <TabletOrMobileShow
        title="Show on tablet and below"
        outerType={CONFIG.possibleOuterTypes.tabletContainerQuery}
      />
      <TabletOrMobileShow
        title="Show on mobile and below"
        outerType={CONFIG.possibleOuterTypes.mobileContainerQuery}
      />
      <OverflowHidden />
    </WrapperWithBottomLine>
  );
};

const TabletOrMobile = ({
  title,
  outerType,
}: {
  title: string;
  outerType?: string;
}) => {
  const hidden = "none";
  const innerType = "display";
  const variable = getSetting(useAppSelector, outerType, innerType);
  const dispatch = useAppDispatch();
  const checked = variable === hidden;

  return (
    <Checkbox
      title={title}
      checked={checked}
      onChange={() => {
        dispatch(
          changeElementStyle({
            types: [outerType, innerType],
            newValue: checked ? "" : hidden,
          })
        );
      }}
    />
  );
};
const TabletOrMobileShow = ({
  title,
  outerType,
}: {
  title: string;
  outerType?: string;
}) => {
  const active = useAppSelector(selectActive);
  const activeType = active?.type;

  const shouldBeFlex =
    activeType === "column" ||
    activeType === "container" ||
    activeType === "fixed" ||
    activeType === "button" ||
    activeType === "row";
  const show = shouldBeFlex ? "flex" : "block";
  const innerType = "display";
  const variable = getSetting(useAppSelector, outerType, innerType);
  const dispatch = useAppDispatch();
  const checked = variable === show;

  return (
    <Checkbox
      title={title}
      checked={checked}
      onChange={() => {
        dispatch(
          changeElementStyle({
            types: [outerType, innerType],
            newValue: checked ? "" : show,
          })
        );
      }}
    />
  );
};

const OverflowHidden = () => {
  const type = "overflow";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  const checked = variable === "hidden";

  return (
    <Checkbox
      title={"Hide overflow"}
      checked={checked}
      onChange={() => {
        dispatch(
          changeElementStyle({
            types: [type],
            newValue: !checked ? "hidden" : "",
          })
        );
      }}
    />
  );
};

const type = "opacity";

const Opacity = () => {
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <OpacityPicker
        variable={variable}
        onChange={(newValue) =>
          dispatch(changeElementStyle({ types: [type], newValue }))
        }
      />
      <ResetButton
        onClick={() =>
          dispatch(changeElementStyle({ types: [type], newValue: "" }))
        }
      />
    </WrapperWithBottomLine>
  );
};

export const OpacityPicker = ({
  variable,
  variablesAvailable = true,
  onChange,
}: {
  variable: StringOrUnd;
  variablesAvailable?: boolean;
  onChange: (e: string) => void;
}) => {
  const sliderValue = convertVarIdToVarName(variable || "", useAppSelector);
  return (
    <>
      <Slider
        value={sliderValue || "1"}
        units={[""]}
        title="Opacity"
        max={1}
        min={0}
        step={0.1}
        onChange={onChange}
      />
      {variablesAvailable && (
        <VariableSelector
          selected={variable || ""}
          type={type}
          onChange={(value) => onChange(value)}
        />
      )}
    </>
  );
};

export default Others;
