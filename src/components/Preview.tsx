import { selectLayout, selectPageWise, useAppSelector } from "@/redux/hooks";
import React, { useRef } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { generateHTML } from "@/utils/HTMLGenerator";
import { useZoom } from "@/contexts/ZoomContext";

const Preview = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const [viewMode] = useViewMode();
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);
  const [zoom] = useZoom();
  const scale = 1 - zoom / 100;
  const ref = useRef<HTMLIFrameElement | null>(null);

  const maxWidth =
    viewMode === "desktop"
      ? "max-w-full"
      : viewMode === "tablet"
      ? "max-w-[768]"
      : "max-w-[360]";

  return (
    <div
      className={"w-full overflow-auto mx-auto " + maxWidth}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "all 0.3s ease",
        height: `${100 / scale}%`,
        backgroundColor: pageWise["background-color"],
      }}
    >
      <div className="h-screen">
        <iframe
          ref={ref}
          key={globalTrigger}
          srcDoc={generateHTML(layout, pageWise)}
          className={"w-full h-full block"}
        ></iframe>
      </div>
    </div>
  );
};

export default Preview;
