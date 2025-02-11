const Checkbox = ({
  checked,
  title,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <form className="mb-2 flex items-center">
      <input
        id={"checkbox-" + title}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-500 focus:ring-2"
      />
      <label
        htmlFor={"checkbox-" + title}
        className="ms-2 text-sm font-medium text-light"
      >
        {title}
      </label>
    </form>
  );
};

export default Checkbox;
