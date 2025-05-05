import { OptionsObject } from "@/utils/Types";
import { ChangeEvent } from "react";
import InfoIcon from "./InfoIcon";

type Props = {
  title: string;
  options: (string | OptionsObject)[];
  selected: string;
  showStyled?: boolean;
  desc?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};
const Select = ({
  title,
  desc,
  showStyled,
  options,
  selected,
  onChange,
}: Props) => {
  return (
    <form className="max-w-sm mx-auto mb-2">
      <div className="flex justify-between">
        <label
          htmlFor={"options-" + title}
          className="block mb-2 text-sm font-medium"
        >
          {title}
        </label>
        {desc && <InfoIcon text={desc} />}
      </div>
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
              value={
                (item as OptionsObject).id
                  ? `var(--${optionLabel})`
                  : optionValue
              }
              style={{
                fontFamily: showStyled ? optionValue : "inherit",
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
