import { createPortal } from "react-dom";
import AmberButtonWithLoading from "./AmberButtonWithLoading";

const Popup = ({
  positiveActionText = "Add",
  onClose,
  className = "max-w-md",
  onEditOrAdd,
  children,
  loading = false,
  editing = false,
}: {
  onClose: () => void;
  onEditOrAdd: () => void;
  children: React.ReactNode;
  editing?: boolean;
  loading?: boolean;
  className?: string;
  positiveActionText?: string;
}) => {
  //creating portal since using fixed naked does not behave correctly
  return createPortal(
    <div
      className={
        "fixed z-[100] top-[10%] left-1/2 -translate-x-1/2 w-[90%] bg-background border border-text rounded p-3 shadow-md " +
        className
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
