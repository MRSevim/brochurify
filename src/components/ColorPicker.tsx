import { selectVariables, useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import SmallText from "./SmallText";
import Slider from "./Slider";

type Props = {
  title: string;
  variableSelect?: boolean;
  selected: string;
  onVarSelect?: (variable: string) => void;
  onChange: (e: string) => void;
};

// Converts hex (3/6/8-digit) + alpha to 8-digit hex string
export function hexToHexWithAlpha(hex: string, alpha: number): string {
  return hex.slice(0, 7) + Math.round(alpha).toString(16).padStart(2, "0");
}

// Separates a hex string like "#RRGGBBAA" into hex and alpha parts
export function separateHexAlpha(hex: string) {
  const cleaned = hex.replace("#", "");
  const hexPart = "#" + cleaned.slice(0, 6);
  const alpha = cleaned.length === 8 ? parseInt(cleaned.slice(6, 8), 16) : 255;
  return { hex: hexPart, alpha };
}

const ColorPicker = ({
  title,
  onVarSelect,
  variableSelect = true,
  selected,
  onChange,
}: Props) => {
  const type = "color";
  const [varOpen, setVarOpen] = useState(false);
  const colorVariables = useAppSelector(selectVariables).filter(
    (item) => item.type === type
  );
  const { hex, alpha } = separateHexAlpha(selected || "#ffffff");

  const handleColorChange = (color: string) => {
    const newHex = hexToHexWithAlpha(color, alpha);
    onChange(newHex);
  };

  const handleAlphaChange = (e: string) => {
    const percent = parseInt(e); // 0–100
    const newAlpha = Math.round((percent / 100) * 255); // convert to 0–255
    const newHex = hexToHexWithAlpha(hex, newAlpha);
    onChange(newHex);
  };

  return (
    <div className="mb-2 flex flex-col gap-2 items-center relative">
      <label htmlFor={"colorpicker-" + title} className="text-sm font-medium">
        {title}
      </label>

      <div className="flex w-full justify-around">
        <div className="mb-1 text-sm font-medium flex flex-col">
          <p className="mb-1">Color</p>
          <div className="relative">
            <div
              className="mx-2 absolute rounded outline outline-text w-10 h-10 border border-2 border-background"
              style={{ backgroundColor: selected }}
            ></div>
            <input
              className="mx-2 opacity-0 w-10 h-10"
              type="color"
              id={"colorpicker-" + title}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        </div>
        <Slider
          showManualInput={false}
          value={Math.round((alpha / 255) * 100).toString()} // shows percentage
          min={0}
          max={100}
          step={1}
          title="Opacity"
          onChange={handleAlphaChange}
        />
      </div>
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
                      if (onVarSelect) onVarSelect(`var(--${color.name})`);
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
