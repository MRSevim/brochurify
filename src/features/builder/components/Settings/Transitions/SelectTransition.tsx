import Select from "@/components/Select";
import {
  selectActiveType,
  selectPageWise,
} from "@/features/builder/lib/redux/selectors";
import { useAppSelector } from "@/lib/redux/hooks";
import { OptionsObject } from "@/features/builder/utils/types.d";
import { Dispatch, SetStateAction, useEffect } from "react";
import { TransformItemPicker } from "../Transform";
import ColorPicker from "../../ColorPicker";
import { OpacityPicker } from "../Others";
import { PositionPicker } from "../FixedSettings";
import { ShorthandTogglerPicker } from "../ShorthandToggler";
import { FontSizePicker } from "../Text/TextRelated";

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

export const TransitionTypeSettings = ({
  innerType,
  editedString,
  setEditedString,
  editedStr,
  variableCreator = false,
}: {
  setEditedString: Dispatch<SetStateAction<string>>;
  variableCreator?: boolean;
  innerType: string;
  editedStr: string;
  editedString: string;
}) => {
  const pageWise = useAppSelector(selectPageWise);
  const activeType = useAppSelector(selectActiveType) || "";

  useEffect(() => {
    let premadeEditedString;
    if (innerType === "translate") {
      premadeEditedString = "0px 0px";
    } else if (innerType === "rotate") {
      premadeEditedString = "0deg";
    } else if (innerType === "scale" || innerType === "opacity") {
      premadeEditedString = "1";
    } else if (
      innerType === "margin" ||
      innerType === "padding" ||
      innerType === "border-radius" ||
      innerType === "margin/padding"
    ) {
      premadeEditedString = "0px 0px 0px 0px";
    } else if (innerType === "font-size") {
      premadeEditedString = "16px";
    } else {
      premadeEditedString = "";
    }
    if (!editedStr) {
      setEditedString(premadeEditedString);
    } else {
      setEditedString(editedStr);
    }
  }, [innerType, editedStr]);
  return (
    <>
      {" "}
      {(innerType === "translate" ||
        innerType === "rotate" ||
        innerType === "scale") && (
        <TransformItemPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          onChange={(newVal) => setEditedString(newVal)}
          variableStr={editedString}
        />
      )}
      {(innerType === "background-color" || innerType === "color") && (
        <ColorPicker
          title="Select color"
          selected={editedString || pageWise[innerType] || "#000000"}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {innerType === "opacity" && (
        <OpacityPicker
          variablesAvailable={!variableCreator}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(((innerType === "top" ||
        innerType === "left" ||
        innerType === "bottom" ||
        innerType === "right") &&
        activeType !== "fixed" &&
        !variableCreator) ||
        innerType === "distance") && (
        <PositionPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "border-radius" ||
        innerType === "padding" ||
        innerType === "margin" ||
        innerType === "margin/padding") && (
        <ShorthandTogglerPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "width" ||
        innerType === "height" ||
        innerType === "width/height") && (
        <PositionPicker
          variablesAvailable={!variableCreator}
          hasAutoOption={true}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {innerType === "font-size" && (
        <FontSizePicker
          variablesAvailable={!variableCreator}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
    </>
  );
};
const availableTransforms: OptionsObject[] = [
  { title: "Move", value: "translate" },
  { title: "Rotate", value: "rotate" },
  { title: "Scale", value: "scale" },
];

export const availableTransitions: OptionsObject[] = [
  ...availableTransforms,
  { title: "Background Color", value: "background-color" },
  { title: "Text Color", value: "color" },
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
  { title: "Font Size", value: "font-size" },
];

export const variableSelectables: OptionsObject[] = [
  { title: "Color", value: "color" },
  { title: "Font family", value: "font-family" },
  { title: "Transition property", value: "transition" },
  ...availableTransforms,
  { title: "Opacity", value: "opacity" },
  { title: "Border Radius", value: "border-radius" },
  { title: "Margin/Padding", value: "margin/padding" },
  { title: "Width/Height", value: "width/height" },
  { title: "Distance from top/left/bottom/right", value: "distance" },
  { title: "Font Size", value: "font-size" },
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
