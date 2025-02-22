import AddButton from "@/components/AddButton";
import BottomLine from "@/components/BottomLine";
import ColorPicker from "@/components/ColorPicker";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import Select from "@/components/Select";
import SmallText from "@/components/SmallText";
import TextInput from "@/components/TextInput";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { selectVariables, useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addVariable,
  deleteVariable,
  editVariable,
} from "@/redux/slices/editorSlice";
import { fontOptions } from "@/utils/Helpers";
import { VariableWithId } from "@/utils/Types";
import { useState } from "react";

const Variables = () => {
  return (
    <ToggleVisibilityWrapper title="Variables">
      <VariablesInner />
    </ToggleVisibilityWrapper>
  );
};

const VariablesInner = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editedVar, setEditedVar] = useState<VariableWithId | null>(null);
  return (
    <div className="flex flex-col items-center relative pb-2 mb-2">
      <SmallText>Add variables that you can use throughout your page</SmallText>
      <AddButton
        onClick={() => {
          setEditedVar(null);
          setShowPopup((prev) => !prev);
        }}
      />
      {showPopup && (
        <Popup
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
const Popup = ({
  onClose,
  editedVar,
}: {
  onClose: () => void;
  editedVar: VariableWithId | null;
}) => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<"color" | "font-family">(
    editedVar?.type || "color"
  );
  const [color, setColor] = useState(editedVar?.value || "#000000");
  const [fontFamily, setFontFamily] = useState(editedVar?.value || "");
  const [name, setName] = useState(editedVar?.name || "");
  return (
    <div className="absolute z-10 w-full bg-background border border-text rounded p-3 top-5">
      {!editedVar && (
        <Select
          title="Pick a variable type"
          showStyled={true}
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
          onChange={(e) => setColor(e.target.value)}
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
      <div className="flex justify-center gap-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={() => {
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
          {editedVar ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );
};
const VariablesList = ({
  onEditClick,
}: {
  onEditClick: (variable: VariableWithId) => void;
}) => {
  const variables = useAppSelector(selectVariables);
  const dispatch = useAppDispatch();

  return (
    <div className="mt-2 w-full">
      {variables.map((variable) => (
        <div
          key={variable.id}
          className="flex justify-between items-center border border-text p-2 m-2"
        >
          <div className="px-2">
            <span className="pe-2 border-r-2">{variable.name}</span>
            <span> {variable.value}</span>
          </div>
          <div className="flex gap-1">
            <EditButton onClick={() => onEditClick(variable)} />
            <DeleteButton onClick={() => dispatch(deleteVariable(variable))} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default Variables;
