import { ChangeEvent } from "react";

const TextareaInput = ({
  title,
  value,
  onChange,
  rows,
}: {
  title: string;
  value: string;
  rows: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="mb-2">
      <label
        htmlFor={"textarea-input-" + title}
        className="block mb-2 text-sm font-medium"
      >
        {title}
      </label>
      <textarea
        id={"textarea-input-" + title}
        rows={rows}
        value={value}
        onChange={onChange}
        className="text-sm rounded-lg block w-full p-2.5"
      />
    </div>
  );
};

export default TextareaInput;
