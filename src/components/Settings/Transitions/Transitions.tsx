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
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
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
import Popup from "@/components/Popup";

const splitValue = ",";
export const availableTransitions: OptionsObject[] = [
  { title: "Move", value: "translate" },
  { title: "Rotate", value: "rotate" },
  { title: "Scale", value: "scale" },
  { title: "Background Color", value: "background-color" },
  { title: "Opacity", value: "opacity" },
  { title: "Top", value: "top" },
  { title: "Left", value: "left" },
  { title: "Bottom", value: "bottom" },
  { title: "Right", value: "right" },
  { title: "Border Radius", value: "border-radius" },
  { title: "Padding", value: "padding" },
  { title: "Margin", value: "margin" },
  { title: "Width", value: "width" },
  { title: "Height", value: "height" },
];

export const filterForFixed = (option: OptionsObject, activeType: string) => {
  if (activeType !== "fixed") {
    if (
      option.value === "top" ||
      option.value === "left" ||
      option.value === "bottom" ||
      option.value === "right"
    ) {
      return false;
    }
  }
  return true;
};

const Transitions = () => {
  const [showPopup, setShowPopup] = useState(false);
  const type = "transition";
  const transitionsString = getSetting(useAppSelector, type);
  const transitions = makeArraySplitFrom(transitionsString, splitValue);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const [editing, setEditing] = useState(false);
  const dispatch = useAppDispatch();

  const firstValueNotInsideTransitions =
    availableTransitions.find(
      (option) => !transitions.some((t) => t.startsWith(option.value))
    )?.value || availableTransitions[0].value;

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
            setShowPopup((prev) => !prev);
          }}
        />
        {showPopup && (
          <PopupComp
            transitions={transitions}
            handleAddOrSave={(value) => {
              if (!editing) {
                handleAddition(value);
              } else {
                handleEditOrDeletion(editedIndex, false, value);
                setEditing(false);
              }
              setShowPopup(false);
            }}
            editing={editing}
            editedStr={
              editing
                ? transitions[editedIndex]
                : firstValueNotInsideTransitions + " 100ms ease-in 0ms"
            }
            onClose={() => {
              setEditedIndex(0);
              setEditing(false);
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
                  onEditClick={() => {
                    setEditedIndex(i);
                    setEditing(true);
                    setShowPopup(true);
                  }}
                  onDeleteClick={() => {
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

const PopupComp = ({
  onClose,
  handleAddOrSave,
  editing,
  editedStr,
  transitions,
}: {
  onClose: () => void;
  editedStr: string;
  editing: boolean;
  transitions: string[];
  handleAddOrSave: (value: string) => void;
}) => {
  const [editedString, setEditedString] = useState(editedStr);
  const handleChange = (value: string) => {
    setEditedString(value);
  };
  const activeType = useAppSelector(selectActive)?.type || "";

  if (!editedStr) return;
  const transitionProperty = getValueFromShorthandStr(editedString, 0);

  return (
    <Popup
      editing={!!editing}
      onClose={onClose}
      onEditOrAdd={() => {
        handleAddOrSave(editedString);
      }}
    >
      {!editing && (
        <SelectTransition
          options={availableTransitions
            .filter(
              (option) => !transitions.some((t) => t.startsWith(option.value))
            )
            .filter((option) => filterForFixed(option, activeType))}
          value={transitionProperty}
          onChange={(value) => {
            handleChange(setValueFromShorthandStr(editedString, 0, value));
          }}
        />
      )}
      <NumberInput
        title="Transition duration (in ms)"
        value={getValueFromShorthandStr(editedString, 1)}
        onChange={(e) => {
          handleChange(
            setValueFromShorthandStr(editedString, 1, e.target.value + "ms")
          );
        }}
      />
      <SelectTimingFunction
        type="Transition"
        value={getValueFromShorthandStr(editedString, 2)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedString, 2, value));
        }}
      />
      <NumberInput
        title="Transition delay (in ms)"
        value={getValueFromShorthandStr(editedString, 3)}
        onChange={(e) => {
          let newValue;
          if (e.target.value === "") {
            newValue = setValueFromShorthandStr(editedString, 3, "0ms");
          } else {
            newValue = setValueFromShorthandStr(
              editedString,
              3,
              e.target.value + "ms"
            );
          }
          handleChange(newValue);
        }}
      />
    </Popup>
  );
};
export const SelectTransition = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (str: string) => void;
  options: OptionsObject[];
}) => {
  return (
    <Select
      title="Transition property"
      options={options}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Transitions;
