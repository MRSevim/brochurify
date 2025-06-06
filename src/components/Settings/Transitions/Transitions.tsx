import { useState } from "react";
import AddButton from "../../AddButton";
import ToggleVisibilityWrapper from "../../ToggleVisibilityWrapper";
import {
  addToString,
  convertVarIdsToVarNames,
  getSetting,
  getValueFromShorthandStr,
  makeArraySplitFrom,
  setValueFromShorthandStr,
  updateOrDeleteAtIndex,
} from "@/utils/Helpers";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import { filterForFixed } from "./SelectTransition";
import NumberInput from "../../NumberInput";
import { SelectTimingFunction } from "../Animations";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import Styles from "./Styles";
import EditableListItem from "../EditableListItem";
import Popup from "@/components/Popup";
import { availableTransitions, SelectTransition } from "./SelectTransition";
import VariableSelector from "@/components/VariableSelector";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";

const splitValue = ",";
const type = "transition";

const Transitions = () => {
  const transitionsString = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  const onAction = (newValue: string) =>
    dispatch(changeElementStyle({ types: [type], newValue }));

  return (
    <ToggleVisibilityWrapper
      title="Transitions"
      desc="Manage transitions for this element"
    >
      <WrapperWithBottomLine flex={true}>
        <SecondaryTitle title="Transition settings">
          <InfoIcon text="Apply general transition settings here. These apply to all the transitions with specified property." />
        </SecondaryTitle>
        <TransitionPropertyAddZone
          transitionsString={transitionsString}
          onAction={onAction}
        />
      </WrapperWithBottomLine>
      <Styles />
    </ToggleVisibilityWrapper>
  );
};

export const TransitionPropertyAddZone = ({
  variablesAvailable = true,
  transitionsString,
  onAction,
}: {
  transitionsString: string;
  variablesAvailable?: boolean;
  onAction: (newVal: string) => void;
}) => {
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const [editing, setEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const transitionsArray = makeArraySplitFrom(transitionsString, splitValue);
  const transitions = convertVarIdsToVarNames(transitionsArray, useAppSelector);

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
    onAction(newValue);
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
      onAction("");
    } else {
      onAction(newValue);
    }
  };
  return (
    <>
      <AddButton
        onClick={() => {
          setShowPopup((prev) => !prev);
        }}
      />
      {variablesAvailable && (
        <VariableSelector
          variablesBehaveAsArray={true}
          selected={transitionsString}
          type={type}
          onChange={(value) => handleAddition(value)}
        />
      )}
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
            {transitions.map((item, i) => {
              const isVar = transitionsArray[i].startsWith("var");

              return (
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
                  showEditButton={!isVar}
                >
                  {isVar
                    ? item
                    : availableTransitions.find(
                        (transition) =>
                          transition.value === getValueFromShorthandStr(item, 0)
                      )?.title}
                </EditableListItem>
              );
            })}
          </div>
        </>
      )}
    </>
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

export default Transitions;
