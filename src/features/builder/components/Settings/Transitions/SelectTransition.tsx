import Select from "@/components/Select";
import { OptionsObject } from "@/utils/types/Types";

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
