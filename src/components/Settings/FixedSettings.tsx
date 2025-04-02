import React, { ChangeEvent, useEffect, useState } from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSetting, getUnit } from "@/utils/Helpers";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import GroupedRadioButtons from "../GroupedRadioButtons";
import NumberInput from "../NumberInput";

const FixedSettings = () => {
  const positionsArr = ["top", "bottom", "left", "right"];
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
  const initialType = getUnit(variable);
  const [radioType, setRadioType] = useState(initialType || "px");

  useEffect(() => {
    if (variable) {
      dispatch(
        changeElementStyle({
          type,
          newValue: parseInt(variable, 10) + radioType,
        })
      );
    }
  }, [radioType]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      dispatch(removeElementStyle({ type }));
    } else {
      dispatch(
        changeElementStyle({ type, newValue: +e.target.value + radioType })
      );
    }
  };

  return (
    <div className="mb-2 flex flex-col items-center">
      <GroupedRadioButtons
        valuesArr={possibleRadioValues}
        checked={radioType}
        name={type}
        onChange={(e) => {
          setRadioType(e.target.value);
        }}
      />

      <NumberInput
        title={type}
        value={variable || ""}
        onChange={handleInputChange}
      ></NumberInput>
    </div>
  );
};

export default FixedSettings;
