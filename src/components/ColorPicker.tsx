import { ChangeEvent } from "react";

type Props = {
  title: string;
  selected: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
// Function to convert RGB or RGBA to Hex
const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (!result) return rgb; // Return if not in RGB format

  const r = parseInt(result[1], 10).toString(16).padStart(2, "0");
  const g = parseInt(result[2], 10).toString(16).padStart(2, "0");
  const b = parseInt(result[3], 10).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

const ColorPicker = ({ title, selected, onChange }: Props) => {
  const converted = rgbToHex(selected);
  return (
    <div className="mb-2 flex items-center">
      <label htmlFor="colorpicker" className="text-sm font-medium text-light">
        {title}
      </label>
      <input
        className="ms-2"
        type="color"
        id="colorpicker"
        value={converted}
        onChange={onChange}
      />
    </div>
  );
};

export default ColorPicker;
