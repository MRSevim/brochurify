import React, { ChangeEvent, useState } from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getUnit } from "@/utils/Helpers";
import { getSetting } from "@/features/builder/utils/helpers";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import GroupedRadioButtons from "@/components/GroupedRadioButtons";
import NumberInput from "@/components/NumberInput";
import { StringOrUnd } from "@/utils/types/Types.d";
import VariableSelector from "../VariableSelector";

const positionsArr = ["top", "bottom", "left", "right"];

const FixedSettings = () => {
  return (
    <ToggleVisibilityWrapper
      title="Fixed Position"
      desc="Set how far the element will be from the sides of its container"
    >
      <div className="flex flex-wrap">
        {positionsArr.map((position) => (
          <div className="w-1/2" key={position}>
            <NumberController type={position} />
          </div>
        ))}
      </div>
    </ToggleVisibilityWrapper>
  );
};

const possibleRadioValues = ["px", "%"];

const NumberController = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);

  const handleInputChange = (newValue: string) => {
    dispatch(changeElementStyle({ types: [type], newValue }));
  };

  return (
    <div className="mb-2 flex flex-col items-center">
      <PositionPicker
        type={type}
        variable={variable}
        onChange={handleInputChange}
      />
    </div>
  );
};

export const PositionPicker = ({
  hasAutoOption = false,
  variablesAvailable = true,
  type,
  variable,
  onChange,
}: {
  type: string;
  variablesAvailable?: boolean;
  hasAutoOption?: boolean;
  variable: StringOrUnd;
  onChange: (newVal: string) => void;
}) => {
  const initialType = getUnit(variable);
  const [radioType, setRadioType] = useState(initialType || "px");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value + radioType);
  };
  return (
    <>
      <GroupedRadioButtons
        valuesArr={
          hasAutoOption ? [...possibleRadioValues, "auto"] : possibleRadioValues
        }
        checked={radioType}
        name={type}
        onChange={(e) => {
          if (variable) {
            onChange(parseInt(variable, 10) + e.target.value);
          }
          setRadioType(e.target.value);
        }}
      />

      <NumberInput
        title={type}
        value={variable || ""}
        onChange={handleInputChange}
      ></NumberInput>

      {variablesAvailable && (
        <VariableSelector
          selected={variable || ""}
          type="distance"
          onChange={(value) => onChange(value)}
        />
      )}
    </>
  );
};

export default FixedSettings;
