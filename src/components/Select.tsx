import { ChangeEvent } from "react";

type Props = {
  title: string;
  options: string[];
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
        {options.map((item, i) => (
          <option
            key={i}
            value={item}
            style={{ fontFamily: showStyled ? item : "default" }}
          >
            {item}
          </option>
        ))}
      </select>
    </form>
  );
};

export default Select;
