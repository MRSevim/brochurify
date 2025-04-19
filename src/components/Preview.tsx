import { selectLayout, selectPageWise, useAppSelector } from "@/redux/hooks";
import React from "react";
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
  const maxWidth =
    viewMode === "desktop"
      ? undefined
      : viewMode === "tablet"
      ? "max-w-[768]"
      : "max-w-[360]";

  return (
    <div
      className="flex justify-center overflow-auto w-full"
      style={{
        height: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "all 0.3s ease",
      }}
    >
      <iframe
        key={globalTrigger}
        srcDoc={generateHTML(layout, pageWise)}
        id="myIframe"
        className={"w-full h-full " + maxWidth}
        height="100%"
        width="100%"
      ></iframe>
    </div>
  );
};

export default Preview;
