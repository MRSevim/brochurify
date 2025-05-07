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
  makeArraySplitFromCommas,
  updateOrDeleteAtIndex,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import NumberInput from "../NumberInput";
import UnitSelector from "../UnitSelector";

const Transform = () => {
  const type = "transform";
  const [showPopup, setShowPopup] = useState(false);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const transformsString = getSetting(useAppSelector, type);
  const transforms = makeArraySplitFromCommas(transformsString);
  const dispatch = useAppDispatch();
  const handleAddition = (editedStr: string) => {
    const newValue = addToString(transformsString || "", editedStr);
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
      deletion
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
              handleAddition("translate(0,0)");
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
        <TransformsList
          transforms={transforms}
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

const TransformsList = ({
  onEditClick,
  onDeleteClick,
  transforms,
}: {
  onEditClick: (i: number) => void;
  onDeleteClick: (i: number) => void;
  transforms: string[];
}) => {
  return (
    <div className="mt-2 w-full">
      {transforms.map((transform, i) => (
        <div
          key={i}
          className="flex justify-between items-center border border-text p-2 m-2"
        >
          <div className="px-2">
            <span className="pe-2 border-r-2">Transform {i + 1}</span>
          </div>
          <div className="flex gap-1">
            <EditButton onClick={() => onEditClick(i)} />
            <DeleteButton onClick={() => onDeleteClick(i)} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Popup = ({
  handleEdit,
  editedStr,
}: {
  editedStr: string;
  handleEdit: (value: string) => void;
}) => {
  const handleChange = (value: string) => {
    handleEdit(value);
  };
  if (!editedStr) return;
  const startingValue = extractStartText(editedStr);
  return (
    <div className="mb-2">
      <TransformType
        value={editedStr}
        onChange={(value) => {
          handleChange(value);
        }}
      />
      {startingValue === "translate" && (
        <div className="flex justify-between">
          <NumberSelector
            title="Coordinates in x Axis"
            value={extractValuesInParentheses(editedStr)[0]}
            handleChange={() => {}}
          />
          <NumberSelector
            title="Coordinates in y Axis"
            value={extractValuesInParentheses(editedStr)[1]}
            handleChange={() => {}}
          />
        </div>
      )}
    </div>
  );
};

const NumberSelector = ({
  title,
  value,
  handleChange,
}: {
  title: string;
  value: string;
  handleChange: (e: string) => void;
}) => {
  const parsed = parseFloat(value); //gets the first full number inside value
  const unit = getUnit(value);
  return (
    <div className="flex">
      <NumberInput
        title="Coordinates in x Axis"
        value={`${parsed}`}
        onChange={(e) => {
          handleChange(e.target.value + unit);
        }}
      >
        <UnitSelector
          value={unit || ""}
          onChange={(e) => handleChange(parsed + e.target.value)}
          title={title}
          units={["px", "%"]}
        />
      </NumberInput>
    </div>
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
