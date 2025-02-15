const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center">
      <button
        className="p-1 text-background bg-gray rounded cursor-pointer"
        onClick={onClick}
      >
        {" "}
        Remove
      </button>
    </div>
  );
};
export default ResetButton;
