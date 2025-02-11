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
    <form className="mb-2">
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
        className="bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
      />
    </form>
  );
};

export default TextareaInput;
