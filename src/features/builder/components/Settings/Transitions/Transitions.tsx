import { useState } from "react";
import AddButton from "@/components/AddButton";
import ToggleVisibilityWrapper from "../../ToggleVisibilityWrapper";
import {
  addToString,
  availableTimingFunctions,
  convertVarIdsToVars,
  findInVariables,
  getSetting,
  getValueFromShorthandStr,
  makeArraySplitFrom,
  setValueFromShorthandStr,
  updateOrDeleteAtIndex,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import { filterForFixed } from "./SelectTransition";
import NumberInput from "@/components/NumberInput";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import Styles from "./Styles";
import EditableListItem from "../EditableListItem";
import Popup from "@/components/Popup";
import { availableTransitions, SelectTransition } from "./SelectTransition";
import VariableSelector from "@/features/builder/components/VariableSelector";
import WrapperWithBottomLine from "@/features/builder/components/WrapperWithBottomLine";
import Select from "@/components/Select";
import {
  selectActiveType,
  selectVariables,
} from "@/features/builder/lib/redux/selectors";

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
  const [editedIndex, setEditedIndex] = useState<number | undefined>(undefined);
  const editing = editedIndex !== undefined;
  const [showPopup, setShowPopup] = useState(false);
  const transitionsArray = makeArraySplitFrom(transitionsString, splitValue);
  const transitions = convertVarIdsToVars(transitionsArray, useAppSelector);

  const firstValueNotInsideTransitions =
    availableTransitions.find(
      (option) =>
        !transitions.some((t) =>
          typeof t === "string"
            ? t?.includes(option.value)
            : t?.value.includes(option.value),
        ),
    )?.value || availableTransitions[0].value;

  const handleAddition = (editedStr: string) => {
    const newValue = addToString(
      transitionsString || "",
      editedStr,
      splitValue,
    );
    onAction(newValue);
  };

  const handleEditOrDeletion = (
    i: number,
    deletion: boolean,
    transition: string | undefined,
  ) => {
    if (!transitionsString) return;
    const newValue = updateOrDeleteAtIndex(
      transitionsString,
      transition,
      i,
      deletion,
      splitValue,
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
          transitions={transitionsArray}
          handleAddOrSave={(value) => {
            if (!editing) {
              handleAddition(value);
            } else {
              handleEditOrDeletion(editedIndex, false, value);
              setEditedIndex(undefined);
            }
            setShowPopup(false);
          }}
          editing={editing}
          editedStr={
            editing
              ? typeof transitions[editedIndex] === "string"
                ? transitions[editedIndex]
                : ""
              : firstValueNotInsideTransitions + " 100ms ease-in 0ms"
          }
          onClose={() => {
            setEditedIndex(undefined);
            setShowPopup(false);
          }}
        />
      )}
      {transitions && (
        <>
          <div className="mt-2 w-full">
            {transitions.map((item, i) => {
              const isVar = typeof item !== "string";

              return (
                <EditableListItem
                  key={i}
                  onEditClick={() => {
                    setEditedIndex(i);
                    setShowPopup(true);
                  }}
                  onDeleteClick={() => {
                    handleEditOrDeletion(i, true, undefined);
                  }}
                  showEditButton={!isVar}
                >
                  {isVar
                    ? item?.name || ""
                    : availableTransitions.find(
                        (transition) =>
                          transition.value ===
                          getValueFromShorthandStr(item, 0),
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
  const variables = useAppSelector(selectVariables);
  const activeType = useAppSelector(selectActiveType) || "";

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
              (option) =>
                !transitions.some((t) => {
                  const variable = findInVariables(t, variables);

                  //filter the existing values (as variable or naked transition) out of options
                  return (
                    variable?.value.includes(option.value) ||
                    t.startsWith(option.value)
                  );
                }),
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
            setValueFromShorthandStr(editedString, 1, e.target.value + "ms"),
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
              e.target.value + "ms",
            );
          }
          handleChange(newValue);
        }}
      />
    </Popup>
  );
};
const SelectTimingFunction = ({
  type,
  value,
  onChange,
}: {
  type: string;
  value: string;
  onChange: (str: string) => void;
}) => {
  return (
    <Select
      title={type + " timing function"}
      options={availableTimingFunctions}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Transitions;
