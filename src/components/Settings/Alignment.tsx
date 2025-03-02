import BottomLine from "@/components/BottomLine";
import ResetButton from "@/components/ResetButton";
import Select from "@/components/Select";
import SmallText from "@/components/SmallText";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import { getSetting } from "@/utils/Helpers";
import { OptionsObject } from "@/utils/Types";
import React from "react";

const horizontalAlignmentOptions = [
  {
    value: "start",
    title: "start",
  },
  { value: "center", title: "center" },
  { value: "end", title: "end" },
  {
    value: "space-between",
    title: "Space evenly (with no space in start and end)",
  },
  {
    value: "space-around",
    title: "Space evenly (with space in start and end)",
  },
];
const verticalAlignmentOptionsForRow = ["start", "center", "end", "stretch"];
const verticalAlignmentOptions = ["start", "center", "end"];

const Alignment = () => {
  const activeType = useAppSelector(selectActive)?.type;
  const isRow = activeType === "row";
  return (
    <ToggleVisibilityWrapper title="Alignment">
      <SmallText>Alignment for this element</SmallText>
      {isRow && (
        <HorizontalOrVertical
          type="justify-content"
          title="Select horizontal alignment type for inner elements"
          options={horizontalAlignmentOptions}
        />
      )}
      <HorizontalOrVertical
        type={isRow ? "align-items" : "text-align"}
        title={
          isRow
            ? "Select vertical alignment type for inner elements"
            : "Select vertical alignment type for this element and its child elements (text-align)"
        }
        options={
          isRow ? verticalAlignmentOptionsForRow : verticalAlignmentOptions
        }
      />
    </ToggleVisibilityWrapper>
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
