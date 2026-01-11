import { useAppSelector } from "@/lib/redux/hooks";
import { ViewActions } from "../../../components/Header/Header";
import { useViewModeState } from "@/features/builder/utils/contexts/ViewModeContext";
import { usePreviewSetter } from "@/features/builder/utils/contexts/PreviewContext";

export const PreviewModal = ({
  html,
  onClose,
  title,
}: {
  onClose?: () => void;
  html: string;
  title?: string;
}) => {
  const viewMode = useViewModeState();
  const setPreview = usePreviewSetter();
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);

  const maxWidth =
    viewMode === "desktop"
      ? "max-w-full"
      : viewMode === "tablet"
        ? "max-w-[768px]"
        : "max-w-[360px]";

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-[110] ">
      <div
        className={"rounded-lg shadow-lg w-full h-full " + maxWidth}
        style={{
          transition: "all 0.3s ease",
        }}
      >
        <button
          onClick={() => {
            if (onClose) onClose();
            setPreview(false);
          }}
          className="absolute top-2 text-deleteRed bg-[rgb(107,114,128)]/50 rounded right-3 z-[120] text-3xl p-1 px-3 hover:bg-[rgb(107,114,128)]/100 transition me-3"
        >
          &times;
        </button>
        <div className="absolute top-2 bg-[rgb(107,114,128)]/50 rounded right-20 z-[120] text-3xl p-1 px-3 hover:bg-[rgb(107,114,128)]/100 transition">
          <ViewActions />
        </div>
        {title && (
          <h2 className="text-xl text-white font-bold left-3 top-2 absolute bg-[rgb(107,114,128)]/60 rounded z-[120] p-1 backdrop-blur-sm ">
            {title}
          </h2>
        )}
        <iframe key={globalTrigger} className="w-full h-full" srcDoc={html} />
      </div>
    </div>
  );
};
