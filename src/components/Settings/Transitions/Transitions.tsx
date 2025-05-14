import { useState } from "react";
import AddButton from "../../AddButton";
import ToggleVisibilityWrapper from "../../ToggleVisibilityWrapper";
import BottomLine from "../../BottomLine";
import {
  addToString,
  getSetting,
  getValueFromShorthandStr,
  makeArraySplitFrom,
  setValueFromShorthandStr,
  updateOrDeleteAtIndex,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Select from "../../Select";
import { OptionsObject } from "@/utils/Types";
import NumberInput from "../../NumberInput";

import { SelectTimingFunction } from "../Animations";

import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import Styles from "./Styles";
import EditableListItem from "../EditableListItem";

const splitValue = ",";
const availableTransitions: OptionsObject[] = [
  { title: "Move", value: "translate" },
  { title: "Rotate", value: "rotate" },
  { title: "Scale", value: "scale" },
  { title: "Background Color", value: "background-color" },
];

const Transitions = () => {
  const [showPopup, setShowPopup] = useState(false);
  const type = "transition";
  const transitionsString = getSetting(useAppSelector, type);
  const transitions = makeArraySplitFrom(transitionsString, splitValue);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleAddition = (editedStr: string) => {
    const newValue = addToString(
      transitionsString || "",
      editedStr,
      splitValue
    );
    dispatch(changeElementStyle({ type, newValue }));
  };

  const handleEditOrDeletion = (
    i: number,
    deletion: boolean,
    transition: string | undefined
  ) => {
    if (!transitionsString) return;
    const newValue = updateOrDeleteAtIndex(
      transitionsString,
      transition,
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
    <ToggleVisibilityWrapper
      title="Transitions"
      desc="Manage transitions for this element"
    >
      <div className="flex flex-col items-center relative pb-2 mb-2">
        <SecondaryTitle title="Transition settings">
          <InfoIcon text="Apply general transition settings here. These apply to all the transitions with specified property." />
        </SecondaryTitle>
        <AddButton
          onClick={() => {
            if (!showPopup) {
              handleAddition("translate 100ms ease-in 0ms");
              setEditedIndex(transitions.length);
            }
            setShowPopup((prev) => !prev);
          }}
        />
        {showPopup && (
          <Popup
            handleEdit={(i, value) => {
              handleEditOrDeletion(i, false, value);
            }}
            editedIndex={editedIndex}
            editedStr={transitions[editedIndex]}
            onClose={() => {
              setEditedIndex(0);
              setShowPopup(false);
            }}
          />
        )}
        {transitions && (
          <>
            <div className="mt-2 w-full">
              {transitions.map((item, i) => (
                <EditableListItem
                  key={i}
                  i={i}
                  onEditClick={(i) => {
                    setEditedIndex(i);
                    setShowPopup(true);
                  }}
                  onDeleteClick={(i) => {
                    handleEditOrDeletion(i, true, undefined);
                  }}
                >
                  {
                    availableTransitions.find(
                      (transition) =>
                        transition.value === getValueFromShorthandStr(item, 0)
                    )?.title
                  }
                </EditableListItem>
              ))}
            </div>
          </>
        )}
        <BottomLine />
      </div>
      <Styles />
    </ToggleVisibilityWrapper>
  );
};

const Popup = ({
  onClose,
  handleEdit,
  editedStr,
  editedIndex,
}: {
  onClose: () => void;
  editedStr: string;
  editedIndex: number;
  handleEdit: (i: number, value: string) => void;
}) => {
  const handleChange = (value: string) => {
    handleEdit(editedIndex, value);
  };
  if (!editedStr) return;
  const transitionProperty = getValueFromShorthandStr(editedStr, 0);

  return (
    <div className="absolute z-10 w-full bg-background border border-text rounded p-3 top-5">
      <SelectTransition
        value={transitionProperty}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 0, value));
        }}
      />

      <NumberInput
        title="Transition duration (in ms)"
        value={getValueFromShorthandStr(editedStr, 1)}
        onChange={(e) => {
          handleChange(
            setValueFromShorthandStr(editedStr, 1, e.target.value + "ms")
          );
        }}
      />
      <SelectTimingFunction
        type="Transition"
        value={getValueFromShorthandStr(editedStr, 2)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 2, value));
        }}
      />
      <NumberInput
        title="Transition delay (in ms)"
        value={getValueFromShorthandStr(editedStr, 3)}
        onChange={(e) => {
          let newValue;
          if (e.target.value === "") {
            newValue = setValueFromShorthandStr(editedStr, 3, "0ms");
          } else {
            newValue = setValueFromShorthandStr(
              editedStr,
              3,
              e.target.value + "ms"
            );
          }
          handleChange(newValue);
        }}
      />

      <div className="flex justify-center gap-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
      </div>
    </div>
  );
};
export const SelectTransition = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  return (
    <Select
      title="Transition property"
      options={availableTransitions}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Transitions;
