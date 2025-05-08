import React, { useState } from "react";
import SecondaryTitle from "../SecondaryTitle";
import InfoIcon from "../InfoIcon";
import BottomLine from "../BottomLine";
import AddButton from "../AddButton";
import RightPanelPopup from "./RightPanelPopup";
import { OptionsObject } from "@/utils/Types";
import Select from "../Select";
import {
  addToString,
  getSetting,
  getUnit,
  makeArraySplitFrom,
  updateOrDeleteAtIndex,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import NumberInput from "../NumberInput";
import UnitSelector from "../UnitSelector";
import EditableList from "./EditableList";

const splitValue = " ";

const Transform = () => {
  const type = "transform";
  const [showPopup, setShowPopup] = useState(false);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const transformsString = getSetting(useAppSelector, type);
  const transforms = makeArraySplitFrom(transformsString, splitValue);
  const dispatch = useAppDispatch();

  const handleAddition = (editedStr: string) => {
    const newValue = addToString(transformsString || "", editedStr, splitValue);
    dispatch(changeElementStyle({ type, newValue }));
  };
  const handleEditOrDeletion = (
    i: number,
    deletion: boolean,
    newVal: string | undefined
  ) => {
    if (!transformsString) return;
    const newValue = updateOrDeleteAtIndex(
      transformsString,
      newVal,
      i,
      deletion,
      splitValue
    );
    if (!newValue) {
      dispatch(removeElementStyle({ type }));
    } else {
      dispatch(changeElementStyle({ type, newValue }));
    }
  };

  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Transform">
        <InfoIcon text="Rotate, scale, skew, or move the element" />
      </SecondaryTitle>

      <div className="flex justify-center mb-2">
        <AddButton
          onClick={() => {
            if (!showPopup) {
              handleAddition("translate(0px,0px)");
              setEditedIndex(transforms.length);
            }
            setShowPopup((prev) => !prev);
          }}
        />
      </div>
      {showPopup && (
        <RightPanelPopup
          onClose={() => {
            setShowPopup(false);
          }}
        >
          <Popup
            handleEdit={(value) => {
              handleEditOrDeletion(editedIndex, false, value);
            }}
            editedStr={transforms[editedIndex]}
          />
        </RightPanelPopup>
      )}
      {transforms && (
        <EditableList
          items={transforms}
          name="Transform"
          onEditClick={(i) => {
            setEditedIndex(i);
            setShowPopup(true);
          }}
          onDeleteClick={(i) => {
            handleEditOrDeletion(i, true, undefined);
          }}
        />
      )}
      <BottomLine />
    </div>
  );
};

const translateUnits = ["px", "%"];
const degreeUnits = ["deg", "turn"];

const Popup = ({
  handleEdit,
  editedStr,
}: {
  editedStr: string;
  handleEdit: (value: string) => void;
}) => {
  if (!editedStr) return;
  const type = extractStartText(editedStr); // e.g., "translate"
  const values = extractValuesInParentheses(editedStr); // e.g., ["0px", "0px"]

  const updateValueAtIndex = (i: number, newVal: string) => {
    const newValues = [...values];
    newValues[i] = newVal;
    handleEdit(`${type}(${newValues.join(", ")})`);
  };

  const handleTypeChange = (newType: string) => {
    let finalParenthesisValue = "";
    if (newType === "translate") {
      finalParenthesisValue = "0px,0px";
    } else if (newType === "rotate" || newType === "skew") {
      finalParenthesisValue = "0deg";
    } else {
      finalParenthesisValue = "1";
    }
    handleEdit(`${newType}(${finalParenthesisValue})`);
  };
  return (
    <div className="mb-2">
      <TransformType value={editedStr} onChange={handleTypeChange} />
      {type === "translate" && (
        <div className="flex justify-between">
          <NumberSelector
            title="Coordinates in x Axis"
            value={values[0] || "0px"}
            units={translateUnits}
            handleChange={(val) => updateValueAtIndex(0, val)}
          />
          <NumberSelector
            units={translateUnits}
            title="Coordinates in y Axis (inverted)"
            value={values[1] || "0px"}
            handleChange={(val) => updateValueAtIndex(1, val)}
          />
        </div>
      )}
      {type === "scale" && (
        <NumberSelector
          title="Scale multiplier"
          value={values[0] || "1"}
          units={[""]}
          handleChange={(val) => updateValueAtIndex(0, val)}
        />
      )}
      {type === "rotate" && (
        <NumberSelector
          title="Rotation degree"
          value={values[0] || "0"}
          units={degreeUnits}
          handleChange={(val) => updateValueAtIndex(0, val)}
        />
      )}
      {type === "skew" && (
        <NumberSelector
          title="Skew degree"
          value={values[0] || "0"}
          units={degreeUnits}
          handleChange={(val) => updateValueAtIndex(0, val)}
        />
      )}
    </div>
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
  const unit = getUnit(value);
  return (
    <NumberInput
      title={title}
      value={`${parsed}`}
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

const availableOptions: OptionsObject[] = [
  { title: "Move", value: "translate" },
  { title: "Scale", value: "scale" },
  { title: "Skew", value: "skew" },
  { title: "Rotate", value: "rotate" },
];

const TransformType = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  return (
    <Select
      title="Type"
      options={availableOptions}
      selected={extractStartText(value)}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const extractStartText = (text: string) => {
  const values = availableOptions.map((option) => option.value);
  const match = values.find((value) => text.startsWith(value));
  return match || "";
};
const extractValuesInParentheses = (str: string): string[] => {
  const match = str.match(/\(([^)]+)\)/);
  if (!match) return [];
  return match[1].split(",").map((v) => v.trim());
};
export default Transform;
