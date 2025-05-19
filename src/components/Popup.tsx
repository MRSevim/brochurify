import { createPortal } from "react-dom";

const Popup = ({
  onClose,
  maxWidth = "md",
  onEditOrAdd,
  children,
  editing,
}: {
  onClose: () => void;
  onEditOrAdd: () => void;
  children: React.ReactNode;
  editing: boolean;
  maxWidth?: string;
}) => {
  const maxW = maxWidth === "4xl" ? "max-w-4xl" : "max-w-md";
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
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onEditOrAdd}
        >
          {editing ? "Save" : "Add"}
        </button>
      </div>
    </div>,
    document.body
  );
};
export default Popup;
