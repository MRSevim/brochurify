const AddButton = ({
  onClick,
  colored = false,
}: {
  onClick: () => void;
  colored?: boolean;
}) => {
  if (colored) {
    return (
      <button
        className="border rounded bg-background text-text border-text	p-3"
        onClick={onClick}
      >
        Add +
      </button>
    );
  }
  return (
    <button className="border rounded border-text	p-3" onClick={onClick}>
      Add +
    </button>
  );
};

export default AddButton;
