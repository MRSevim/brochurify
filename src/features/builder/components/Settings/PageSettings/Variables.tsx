import AddButton from "@/components/AddButton";
import ColorPicker from "@/features/builder/components/ColorPicker";
import Popup from "@/components/Popup";
import Select from "@/components/Select";
import TextInput from "@/components/TextInput";
import ToggleVisibilityWrapper from "@/features/builder/components/ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addVariable,
  deleteVariable,
  editVariable,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { fontOptions } from "@/utils/Helpers";
import { Variable } from "@/utils/Types";
import { useState } from "react";
import EditableListItem from "../EditableListItem";
import { TransitionPropertyAddZone } from "../Transitions/Transitions";
import { TransitionTypeSettings } from "../Transitions/Styles";
import { variableSelectables } from "../Transitions/SelectTransition";
import WrapperWithBottomLine from "@/features/builder/components/WrapperWithBottomLine";
import { selectVariables } from "@/features/builder/lib/redux/selectors";

const Variables = () => {
  return (
    <ToggleVisibilityWrapper
      title="Variables"
      desc="Add variables that you can use throughout your page"
    >
      <VariablesInner />
    </ToggleVisibilityWrapper>
  );
};

const VariablesInner = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editedVar, setEditedVar] = useState<Variable | null>(null);
  return (
    <WrapperWithBottomLine flex={true}>
      <AddButton
        onClick={() => {
          setEditedVar(null);
          setShowPopup((prev) => !prev);
        }}
      />
      {showPopup && (
        <PopupComp
          onClose={() => {
            setEditedVar(null);
            setShowPopup(false);
          }}
          editedVar={editedVar}
        />
      )}
      <VariablesList
        onEditClick={(variable) => {
          setEditedVar(variable);
          setShowPopup(true);
        }}
      />
    </WrapperWithBottomLine>
  );
};
const PopupComp = ({
  onClose,
  editedVar,
}: {
  onClose: () => void;
  editedVar: Variable | null;
}) => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<Variable["type"]>(
    editedVar?.type || "color"
  );
  const [value, setValue] = useState(editedVar?.value || "");
  const [name, setName] = useState(editedVar?.name || "");
  const editing = !!editedVar;

  return (
    <Popup
      editing={editing}
      onClose={onClose}
      onEditOrAdd={() => {
        if (editedVar) {
          dispatch(
            editVariable({
              ...editedVar,
              name,
              value,
            })
          );
        } else {
          dispatch(
            addVariable({
              type,
              name,
              value,
            })
          );
        }
        onClose();
      }}
    >
      {!editedVar && (
        <Select
          title="Pick a variable type"
          showStyled={false}
          options={variableSelectables}
          selected={type}
          onChange={(e) => {
            setType(e.target.value as Variable["type"]);
          }}
        />
      )}
      <TextInput
        title="Name of your variable"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {type === "color" ? (
        <ColorPicker
          variableSelect={false}
          title="Pick a color"
          selected={value || "#000000"}
          onChange={(e) => setValue(e)}
        />
      ) : type === "font-family" ? (
        <Select
          title="Pick a font"
          showStyled={true}
          options={fontOptions}
          selected={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : type === "transition" ? (
        <div className="flex flex-col items-center">
          <TransitionPropertyAddZone
            variablesAvailable={false}
            transitionsString={value || ""}
            onAction={(newVal: string) => setValue(newVal)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <TransitionTypeSettings
            innerType={type}
            editedStr={editedVar?.value || ""}
            setEditedString={setValue}
            editedString={value}
            variableCreator={true}
          />
        </div>
      )}
    </Popup>
  );
};
const VariablesList = ({
  onEditClick,
}: {
  onEditClick: (variable: Variable) => void;
}) => {
  const variables = useAppSelector(selectVariables);
  const dispatch = useAppDispatch();

  return (
    <div className="mt-2 w-full">
      {variables.map((variable, i) => (
        <EditableListItem
          key={variable.id}
          onEditClick={() => onEditClick(variable)}
          onDeleteClick={() => dispatch(deleteVariable(variable))}
        >
          <span>{variable.name}</span>
        </EditableListItem>
      ))}
    </div>
  );
};
export default Variables;
