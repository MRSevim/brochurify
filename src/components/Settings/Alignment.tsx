import BottomLine from "@/components/BottomLine";
import ResetButton from "@/components/ResetButton";
import Select from "@/components/Select";
import SmallText from "@/components/SmallText";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  changeInnerElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import { CONFIG, getSetting } from "@/utils/Helpers";
import { OptionsObject } from "@/utils/Types";
import React from "react";
import Checkbox from "../Checkbox";

const justifyContentAlignmentOptionsForRow = [
  {
    value: "start",
    title: "Left",
  },
  { value: "center", title: "Center" },
  { value: "end", title: "Right" },
  {
    value: "space-between",
    title: "Space evenly (with no space in start and end)",
  },
  {
    value: "space-around",
    title: "Space evenly (with space in start and end)",
  },
];
const alignItemsAlignmentOptionsForRow = [
  {
    value: "start",
    title: "Top",
  },
  {
    value: "center",
    title: "Center",
  },
  {
    value: "end",
    title: "Bottom",
  },
  {
    value: "stretch",
    title: "Stretch",
  },
];
const justifyContentAlignmentOptionsForColumn = [
  {
    value: "start",
    title: "Top",
  },
  { value: "center", title: "Center" },
  { value: "end", title: "Bottom" },
  {
    value: "space-between",
    title: "Space evenly (with no space in start and end)",
  },
  {
    value: "space-around",
    title: "Space evenly (with space in start and end)",
  },
];
const alignItemsAlignmentOptionsForColumn = [
  {
    value: "start",
    title: "Left",
  },
  {
    value: "center",
    title: "Center",
  },
  {
    value: "end",
    title: "Right",
  },
  {
    value: "stretch",
    title: "Stretch",
  },
];

const Alignment = () => {
  const activeType = useAppSelector(selectActive)?.type;
  const isRow = activeType === "row";
  const otherAlignable =
    activeType === "column" ||
    activeType === "container" ||
    activeType === "fixed" ||
    activeType === "button";
  return (
    <ToggleVisibilityWrapper
      title="Alignment"
      desc="Change the alignment of items inside"
    >
      {isRow && (
        <>
          <HorizontalOrVertical
            type="justify-content"
            title="Horizontal alignment"
            options={justifyContentAlignmentOptionsForRow}
          />
          <HorizontalOrVertical
            type="align-items"
            title="Vertical alignment"
            options={alignItemsAlignmentOptionsForRow}
          />
        </>
      )}
      {otherAlignable && (
        <>
          <HorizontalOrVertical
            type="justify-content"
            title="Vertical alignment"
            options={justifyContentAlignmentOptionsForColumn}
          />
          <HorizontalOrVertical
            type="align-items"
            title="Horizontal alignment"
            options={alignItemsAlignmentOptionsForColumn}
          />
        </>
      )}

      {isRow && <Reverse />}
    </ToggleVisibilityWrapper>
  );
};

const Reverse = () => {
  return (
    <div className="relative pb-2 mb-2">
      <TabletOrMobile
        title="Reverse on tablet"
        outerType={CONFIG.possibleOuterTypes.tabletContainerQuery}
      />
      <TabletOrMobile
        title="Reverse on mobile"
        outerType={CONFIG.possibleOuterTypes.mobileContainerQuery}
      />
      <SmallText>Only reverses if items are stacked</SmallText>
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
  const reverse = "wrap-reverse";
  const innerType = "flex-wrap";
  const variable = getSetting(useAppSelector, outerType, innerType);
  const dispatch = useAppDispatch();
  const checked = variable === reverse;

  return (
    <Checkbox
      title={title}
      checked={checked}
      onChange={() => {
        dispatch(
          changeInnerElementStyle({
            outerType,
            innerType,
            newValue: checked ? "" : reverse,
          })
        );
      }}
    />
  );
};

const HorizontalOrVertical = ({
  type,
  title,
  options,
}: {
  type: string;
  title: string;
  options: OptionsObject[] | string[];
}) => {
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <Select
        title={title}
        showStyled={false}
        options={options}
        selected={variable || ""}
        onChange={(e) => {
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          );
        }}
      />
      <ResetButton onClick={() => dispatch(removeElementStyle({ type }))} />
      <BottomLine />
    </div>
  );
};

export default Alignment;
