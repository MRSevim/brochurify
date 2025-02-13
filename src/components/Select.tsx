import { OptionsObject } from "@/utils/Types";
import { ChangeEvent } from "react";

type Props = {
  title: string;
  options: (string | OptionsObject)[];
  selected: string;
  showStyled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};
const Select = ({ title, showStyled, options, selected, onChange }: Props) => {
  return (
    <form className="max-w-sm mx-auto mb-2">
      <label
        htmlFor={"options-" + title}
        className="block mb-2 text-sm font-medium"
      >
        {title}
      </label>
      <select
        value={selected}
        onChange={onChange}
        id={"options-" + title}
        className="bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-500 block w-full p-2.5"
      >
        {options.map((item, i) => {
          const optionValue = (item as OptionsObject).value
            ? (item as OptionsObject).value
            : (item as string);
          const optionLabel = (item as OptionsObject).value
            ? (item as OptionsObject).title
            : (item as string);
          return (
            <option
              key={i}
              value={optionValue}
              style={{
                fontFamily:
                  showStyled && item !== "initial" ? optionValue : "inherit",
              }}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </form>
  );
};

export default Select;
