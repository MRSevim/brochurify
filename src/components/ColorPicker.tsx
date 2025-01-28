import { ChangeEvent } from "react";

type Props = {
  title: string;

  selected: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const ColorPicker = ({ title, selected, onChange }: Props) => {
  return (
    <div className="mb-2 flex items-center">
      <label htmlFor="colorpicker" className="text-sm font-medium text-light">
        {title}
      </label>
      <input
        className="ms-2"
        type="color"
        id="colorpicker"
        value={selected}
        onChange={onChange}
      />
    </div>
  );
};

export default ColorPicker;
