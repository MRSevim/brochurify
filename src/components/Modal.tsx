import { useState } from "react";
import { ViewMode } from "./Header/ViewMode";

export const Modal = ({
  onClose,
  children,
  title,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => {
  const [viewMode, setViewMode] = useState("desktop");
  const maxWidth =
    viewMode === "desktop"
      ? "max-w-full"
      : viewMode === "tablet"
      ? "max-w-[768]"
      : "max-w-[360]";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[110]">
      <div
        style={{ transition: "all 0.3s ease" }}
        className={"rounded-lg shadow-lg w-full relative " + maxWidth}
      >
        <button
          onClick={onClose}
          className="absolute top-2 text-deleteRed bg-[rgb(107,114,128)]/50 rounded right-3 z-[120] text-3xl p-1 px-3 rounded-full hover:bg-[rgb(107,114,128)]/100 transition"
        >
          &times;
        </button>
        <div className="absolute top-2 bg-[rgb(107,114,128)]/50 rounded right-20 z-[120] text-3xl p-1 px-3 hover:bg-[rgb(107,114,128)]/100 transition">
          <ViewMode selected={viewMode} onSelect={(i) => setViewMode(i)} />
        </div>
        <h2 className="text-xl font-bold left-3 top-2 absolute bg-[rgb(107,114,128)]/50 rounded z-[120] p-1 backdrop-blur-sm ">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};
