import { useAppSelector } from "@/redux/hooks";
import { ChangeEvent, useState } from "react";
import SmallText from "./SmallText";

type Props = {
  title: string;
  variableSelect?: boolean;
  selected: string;
  onVarSelect?: (variable: string) => void;
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

const ColorPicker = ({
  title,
  onVarSelect,
  variableSelect = true,
  selected,
  onChange,
}: Props) => {
  const type = "color";
  const [varOpen, setVarOpen] = useState(false);
  const colorVariables = useAppSelector(
    (state) => state.editor.variables
  ).filter((item) => item.type === type);
  const converted = rgbToHex(selected);

  return (
    <div className="mb-2 flex items-center relative">
      <label
        htmlFor={"colorpicker-" + title}
        className="text-sm font-medium text-light"
      >
        {title}
      </label>
      <input
        className="mx-2"
        type="color"
        id={"colorpicker-" + title}
        value={converted}
        onChange={onChange}
      />
      {variableSelect && (
        <button
          className="p-2 border border-text rounded"
          onClick={() => setVarOpen((prev) => !prev)}
        >
          Var
        </button>
      )}
      {varOpen && (
        <div className="absolute w-full z-10 bg-background border border-text rounded p-3 top-5">
          Select your variable
          <div className="my-2">
            {colorVariables.length > 0 && (
              <div className="flex flex-wrap">
                {colorVariables.map((color) => (
                  <div
                    key={color.id}
                    className="flex gap-3 justify-center items-center py-2 pe-2 w-1/2 cursor-pointer hover:shadow-sm hover:shadow-text hover:z-50"
                    onClick={() => {
                      setVarOpen(false);
                      if (onVarSelect) onVarSelect(color.value);
                    }}
                  >
                    {color.name}{" "}
                    <div
                      className="size-5"
                      style={{ backgroundColor: color.value }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
            {colorVariables.length === 0 && (
              <SmallText>No variables of type {type} is set</SmallText>
            )}
          </div>
          <button
            className="p-1 text-background bg-gray rounded cursor-pointer"
            onClick={() => setVarOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
