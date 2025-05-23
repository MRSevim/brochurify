import AmberButtonWithLoading from "./AmberButtonWithLoading";

const ConfirmationPopup = ({
  onClose,
  maxWidth = "md",
  onConfirm,
  text,
  loading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  loading: boolean;
  maxWidth?: string;
}) => {
  const maxW = maxWidth === "4xl" ? "max-w-4xl" : "max-w-md";
  return (
    <div
      className={
        "fixed text-center z-[100] top-[10%] left-1/2 -translate-x-1/2 w-[90%] bg-background text-text border border-text rounded p-3 shadow-md " +
        maxW
      }
    >
      {text}
      <div className="flex justify-center gap-2 mt-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
        <AmberButtonWithLoading
          onClick={onConfirm}
          loading={loading}
          text="Confirm"
        />
      </div>
    </div>
  );
};
export default ConfirmationPopup;
