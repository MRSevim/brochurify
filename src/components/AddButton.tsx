const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="border rounded border-text	p-3" onClick={onClick}>
      Add +
    </button>
  );
};

export default AddButton;
