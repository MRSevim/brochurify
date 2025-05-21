import {
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppSelector,
} from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { generateHTML } from "@/utils/HTMLGenerator";
import { useZoom } from "@/contexts/ZoomContext";
import { ShadowContent } from "./ShadowContent";

const Preview = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const variables = useAppSelector(selectVariables);
  const [viewMode] = useViewMode();
  const [zoom] = useZoom();
  const scale = 1 - zoom / 100;
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(ref.current.scrollHeight);
    }
  }, [zoom]);

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
        maxHeight,
      }}
      ref={ref}
    >
      <ShadowContent html={generateHTML(layout, pageWise, variables, true)} />
    </div>
  );
};

export default Preview;
