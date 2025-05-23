import Select from "@/components/Select";
import { OptionsObject } from "@/utils/Types";

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
