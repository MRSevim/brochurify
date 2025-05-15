import React from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import { CONFIG, getSetting } from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Checkbox from "../Checkbox";
import {
  changeElementStyle,
  changeInnerElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Transform from "./Transform";
import Slider from "../Slider";
import ResetButton from "../ResetButton";
import { StringOrUnd } from "@/utils/Types";

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
    <div className="relative pb-2 mb-2">
      <TabletOrMobile
        title="Hide on tablet and below"
        outerType={CONFIG.possibleOuterTypes.tabletContainerQuery}
      />
      <TabletOrMobile
        title="Hide on mobile and below"
        outerType={CONFIG.possibleOuterTypes.mobileContainerQuery}
      />
      <BottomLine />
    </div>
  );
};

const TabletOrMobile = ({
  title,
  outerType,
}: {
  title: string;
  outerType: string;
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
          changeInnerElementStyle({
            outerType,
            innerType,
            newValue: checked ? "" : hidden,
          })
        );
      }}
    />
  );
};

const Opacity = () => {
  const type = "opacity";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <OpacityPicker
        variable={variable}
        onChange={(newValue) =>
          dispatch(changeElementStyle({ type, newValue }))
        }
      />
      <ResetButton onClick={() => dispatch(removeElementStyle({ type }))} />
      <BottomLine />
    </div>
  );
};

export const OpacityPicker = ({
  variable,
  onChange,
}: {
  variable: StringOrUnd;
  onChange: (e: string) => void;
}) => {
  return (
    <Slider
      value={variable || "1"}
      units={[""]}
      title="Opacity"
      max={1}
      min={0}
      step={0.1}
      onChange={onChange}
    />
  );
};
export default Others;
