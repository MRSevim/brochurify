import { getUnit } from "@/utils/Helpers";

type Props = {
  min?: number;
  max: number;
  step?: number;
  value: string;
  title: string;
  units?: string[];
  showManualInput?: boolean;
  onChange: (e: string) => void;
};
const Slider = ({
  min = 1,
  max,
  step = 1,
  title,
  onChange,
  value,
  units = ["px", "em", "%"],
  showManualInput = true,
}: Props) => {
  const parsed = parseFloat(value); //gets the first full number inside value
  const unit = getUnit(value);
  const maxNumber =
    unit === "%"
      ? 300
      : unit === "px"
      ? 80
      : unit === "em" || unit === "rem"
      ? 6
      : max;

  const minNumber = unit === "em" || unit === "rem" || unit === "%" ? 0 : min;
  const stepValue = unit === "em" || unit === "rem" ? 0.1 : step;

  return (
    <div className="flex items-center justify-around">
      <div className="relative mb-8 flex-1">
        <label
          htmlFor={"steps-range-" + title}
          className="text-center mb-1 text-sm font-medium "
        >
          {title}
        </label>

        <input
          id={"steps-range-" + title}
          type="range"
          min={minNumber}
          max={maxNumber}
          value={parsed}
          step={stepValue}
          onChange={(e) => onChange(e.target.value + unit)}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        />

        <span className="text-sm text-gray-400 absolute start-0 -bottom-6">
          {minNumber}
        </span>
        <span className="text-sm text-gray-400 absolute start-0 end-0 mx-auto text-center -bottom-6">
          Current:{value}
        </span>
        <span className="text-sm text-gray-400 absolute end-0 -bottom-6">
          {maxNumber}
        </span>
      </div>
      {showManualInput && (
        <div className="flex items-center ms-1">
          <input
            type="number"
            id={"steps-range-alternative-input-" + title}
            value={parsed}
            step=".1"
            onChange={(e) => onChange(e.target.value + unit)}
            className="w-12 bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-1"
          />
          <select
            value={unit}
            onChange={(e) => onChange(parsed + e.target.value)}
            id={"unit-options-" + title}
            className="w-12 bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-500 p-1"
          >
            {units.map((item) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
};

export default Slider;
