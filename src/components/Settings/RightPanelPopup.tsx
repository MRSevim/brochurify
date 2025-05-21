const RightPanelPopup = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <div className="absolute z-10 w-full bg-background border border-text rounded p-3 top-5">
      {children}
      <div className="flex justify-center gap-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
      </div>
    </div>
  );
};
export default RightPanelPopup;
