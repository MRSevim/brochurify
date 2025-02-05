import { ChangeEvent } from "react";

const LinkInput = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form className="mb-2">
      <label
        htmlFor="link-input"
        className="block mb-2 text-sm font-medium text-light"
      >
        {title}
      </label>
      <input
        type="url"
        id="link-input"
        value={value}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-light text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
      />
    </form>
  );
};

export default LinkInput;
