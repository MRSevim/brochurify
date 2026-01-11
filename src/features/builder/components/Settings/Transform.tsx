import React from "react";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import {
  getSetting,
  getUnit,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import NumberInput from "@/components/NumberInput";
import UnitSelector from "../UnitSelector";
import ToggleBtn from "@/components/ToggleBtn";
import VariableSelector from "../VariableSelector";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

const availableOptions = [
  { title: "Move", type: "translate" },
  { title: "Scale", type: "scale" },
  { title: "Rotate", type: "rotate" },
];

const Transform = () => {
  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Transform">
        <InfoIcon text="Rotate, scale, skew, or move the element" />
      </SecondaryTitle>
      {availableOptions.map((option) => (
        <TransformItem
          key={option.title}
          title={option.title}
          type={option.type}
        />
      ))}
    </div>
  );
};

const translateUnits = ["px", "%"];
const degreeUnits = ["deg", "turn"];

export const TransformItem = ({
  type,
  title,
}: {
  type: string;
  outerType?: string;
  title?: string;
}) => {
  const variableStr = getSetting(useAppSelector, type);
  const toggled = !!variableStr;
  const dispatch = useAppDispatch();

  const changeStyle = (newValue: string) => {
    dispatch(
      changeElementStyle({
        types: [type],
        newValue,
      })
    );
  };

  const setToInitial = () => {
    let newValue;
    if (type === "translate") {
      newValue = "0px 0px";
    } else if (type === "rotate") {
      newValue = "0deg";
    } else {
      newValue = "1";
    }
    changeStyle(newValue);
  };

  const handleToggle = () => {
    if (!toggled) {
      setToInitial();
    } else {
      dispatch(
        changeElementStyle({
          types: [type],
          newValue: "",
        })
      );
    }
  };

  return (
    <WrapperWithBottomLine>
      <div className="w-full text-center">
        {title ? (
          <SecondaryTitle title={title}>
            <ToggleBtn checked={toggled} onChange={handleToggle} />
          </SecondaryTitle>
        ) : (
          <ToggleBtn checked={toggled} onChange={handleToggle} />
        )}

        {toggled && (
          <TransformItemPicker
            type={type}
            onChange={changeStyle}
            variableStr={variableStr}
          />
        )}
      </div>
    </WrapperWithBottomLine>
  );
};

export const TransformItemPicker = ({
  variablesAvailable = true,
  type,
  onChange,
  variableStr,
}: {
  type: string;
  onChange: (str: string) => void;
  variablesAvailable?: boolean;
  variableStr: string;
}) => {
  const handleChange = (e: string, i: number) => {
    if (e) onChange(setValueFromShorthandStr(variableStr, i, e));
  };

  const valueAt = (index: number) =>
    getValueFromShorthandStr(variableStr, index);
  return (
    <>
      {type === "translate" && (
        <div className="flex justify-between">
          <NumberSelector
            title="Coordinates in x Axis"
            value={valueAt(0)}
            units={translateUnits}
            handleChange={(e) => handleChange(e, 0)}
          />
          <NumberSelector
            units={translateUnits}
            title="Coordinates in y Axis (inverted)"
            value={valueAt(1)}
            handleChange={(e) => handleChange(e, 1)}
          />
        </div>
      )}
      {type === "scale" && (
        <NumberSelector
          title="Scale multiplier"
          value={valueAt(0)}
          units={[""]}
          handleChange={(e) => handleChange(e, 0)}
        />
      )}
      {type === "rotate" && (
        <NumberSelector
          title="Rotation degree"
          value={valueAt(0)}
          units={degreeUnits}
          handleChange={(e) => handleChange(e, 0)}
        />
      )}

      {variablesAvailable && (
        <VariableSelector
          selected={variableStr}
          type={type}
          onChange={(value) => onChange(value)}
        />
      )}
    </>
  );
};

const NumberSelector = ({
  title,
  value,
  units,
  handleChange,
}: {
  title: string;
  value: string;
  units: string[];
  handleChange: (e: string) => void;
}) => {
  const parsed = parseFloat(value); //gets the first full number inside value

  const unit = getUnit(value) || "";
  return (
    <NumberInput
      title={title}
      value={value}
      onChange={(e) => {
        handleChange(e.target.value + unit);
      }}
    >
      <UnitSelector
        value={unit || ""}
        onChange={(e) => handleChange(parsed + e.target.value)}
        title={title}
        units={units}
      />
    </NumberInput>
  );
};

export default Transform;
