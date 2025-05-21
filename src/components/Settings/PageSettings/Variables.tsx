import AddButton from "@/components/AddButton";
import BottomLine from "@/components/BottomLine";
import ColorPicker from "@/components/ColorPicker";
import Popup from "@/components/Popup";
import Select from "@/components/Select";
import TextInput from "@/components/TextInput";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { selectVariables, useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addVariable,
  deleteVariable,
  editVariable,
} from "@/redux/slices/editorSlice";
import { fontOptions } from "@/utils/Helpers";
import { Variable } from "@/utils/Types";
import { useState } from "react";
import EditableListItem from "../EditableListItem";

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
    <div className="flex flex-col items-center relative pb-2 mb-2">
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
      <BottomLine />
    </div>
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
  const [type, setType] = useState<"color" | "font-family">(
    editedVar?.type || "color"
  );
  const [color, setColor] = useState(editedVar?.value || "#000000");
  const [fontFamily, setFontFamily] = useState(editedVar?.value || "");
  const [name, setName] = useState(editedVar?.name || "");
  return (
    <Popup
      editing={!!editedVar}
      onClose={onClose}
      onEditOrAdd={() => {
        if (editedVar) {
          dispatch(
            editVariable({
              ...editedVar,
              name,
              value: type === "font-family" ? fontFamily : color,
            })
          );
        } else {
          dispatch(
            addVariable({
              type,
              name,
              value: type === "font-family" ? fontFamily : color,
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
          options={["color", "font-family"]}
          selected={type}
          onChange={(e) => {
            if (e.target.value !== "font-family" && e.target.value !== "color")
              return;
            setType(e.target.value);
          }}
        />
      )}
      <TextInput
        title="Name of your variable"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {type === "color" && (
        <ColorPicker
          variableSelect={false}
          title="Pick a color"
          selected={color}
          onChange={(e) => setColor(e)}
        />
      )}
      {type === "font-family" && (
        <Select
          title="Pick a font"
          showStyled={true}
          options={fontOptions}
          selected={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        />
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
          <span className="pe-2 border-r-2">{variable.name}</span>
          <span> {variable.value}</span>
        </EditableListItem>
      ))}
    </div>
  );
};
export default Variables;
