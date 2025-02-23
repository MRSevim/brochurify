import BottomLine from "@/components/BottomLine";
import ResetButton from "@/components/ResetButton";
import Select from "@/components/Select";
import SmallText from "@/components/SmallText";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
const verticalAlignmentOptions = ["start", "center", "end", "stretch"];
const Alignment = () => {
  return (
    <ToggleVisibilityWrapper title="Alignment">
      <SmallText>Alignment for row elements</SmallText>
      <HorizontalOrVertical
        type="justify-content"
        title="Select horizontal alignment type"
        options={horizontalAlignmentOptions}
      />
      <HorizontalOrVertical
        type="align-items"
        title="Select vertical alignment type"
        options={verticalAlignmentOptions}
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
