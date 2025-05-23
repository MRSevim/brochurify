import { createPortal } from "react-dom";
import AmberButtonWithLoading from "./AmberButtonWithLoading";

const Popup = ({
  positiveActionText = "Add",
  onClose,
  maxWidth = "md",
  onEditOrAdd,
  children,
  loading = false,
  editing,
}: {
  onClose: () => void;
  onEditOrAdd: () => void;
  children: React.ReactNode;
  editing: boolean;
  loading?: boolean;
  maxWidth?: string;
  positiveActionText?: string;
}) => {
  const maxW = maxWidth === "4xl" ? "max-w-4xl" : "max-w-md";

  //creating portal since using fixed naked does not behave correctly
  return createPortal(
    <div
      className={
        "fixed z-[100] top-[10%] left-1/2 -translate-x-1/2 w-[90%] bg-background border border-text rounded p-3 shadow-md " +
        maxW
      }
    >
      {children}
      <div className="flex justify-center gap-2 mt-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
        <AmberButtonWithLoading
          onClick={onEditOrAdd}
          loading={loading}
          text={editing ? "Save" : positiveActionText}
        />
      </div>
    </div>,
    document.body
  );
};
export default Popup;
