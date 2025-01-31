import React from "react";

type Props = { text?: string; checked: boolean; onChange: () => void };
const ToggleBtn = ({ text, checked, onChange }: Props) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        onChange={onChange}
      />
      <div className="relative w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
      <span className="ms-3 text-sm font-medium text-light ">
        {text && text}
      </span>
    </label>
  );
};

export default ToggleBtn;
