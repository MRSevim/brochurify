import React from "react";

const UnitSelector = ({
  value,
  onChange,
  title,
  units,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  title: string;
  units: string[];
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      id={"unit-options-" + title}
      className="w-12 border border-gray-600 text-sm rounded-lg p-1"
    >
      {units.map((item) => {
        return (
          <option key={item} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default UnitSelector;
