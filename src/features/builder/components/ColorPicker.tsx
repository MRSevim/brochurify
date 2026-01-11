import { selectVariables, useAppSelector } from "@/lib/redux/hooks";
import Slider from "../../../components/Slider";
import VariableSelector from "./VariableSelector";

type Props = {
  title: string;
  variableSelect?: boolean;
  selected: string;
  onChange: (e: string) => void;
};

// Converts a hex color (#rrggbb) and alpha (0–255) to 8-digit hex string (#rrggbbaa)
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

function rgbStringToHex(input: string): string {
  const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/;
  const match = input.trim().match(rgbRegex);
  if (!match) return input;

  const [, r, g, b, a] = match;
  const toHex = (n: string) => parseInt(n).toString(16).padStart(2, "0");
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (a !== undefined) {
    const alpha = Math.round(parseFloat(a) * 255);
    return `${hex}${alpha.toString(16).padStart(2, "0")}`;
  }

  return hex;
}
const ColorPicker = ({
  title,
  variableSelect = true,
  selected,
  onChange,
}: Props) => {
  const type = "color";
  const colorVariables = useAppSelector(selectVariables).filter(
    (item) => item.type === type
  );
  const isVariable = selected.startsWith("var(--");
  const variableId = isVariable
    ? selected.slice(6, -1) // Extract the ID from `var(--<id>)`
    : null;

  const finalSelected = isVariable
    ? (colorVariables.find((v) => v.id === variableId)?.value ?? "#ffffff")
    : rgbStringToHex(selected);

  const { hex, alpha } = separateHexAlpha(finalSelected || "#ffffff");

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
              style={{ backgroundColor: finalSelected }}
            ></div>
            <input
              value={hex}
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
        <VariableSelector selected={selected} type={type} onChange={onChange} />
      )}
    </div>
  );
};

export default ColorPicker;
