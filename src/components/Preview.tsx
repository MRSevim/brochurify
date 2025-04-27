import { selectLayout, selectPageWise, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
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
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) setMaxHeight(ref.current.scrollHeight);
  }, []);

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
        fontFamily: "initial",
        maxHeight,
      }}
      ref={ref}
    >
      <ShadowContent
        key={globalTrigger}
        html={generateHTML(layout, pageWise, true)}
      />
    </div>
  );
};

export default Preview;

function ShadowContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<ShadowRoot | null>(null); // Save shadow root separately

  useEffect(() => {
    if (containerRef.current) {
      if (!shadowRef.current) {
        // Only attach shadow once
        shadowRef.current = containerRef.current.attachShadow({ mode: "open" });
      }

      // Find <style> tags and replace 'body' with 'shadow-root'
      const newHtml = html.replace(
        /<style[^>]*>([\s\S]*?)<\/style>/g,
        (match, cssContent) => {
          const modifiedCss = cssContent.replace(/body/g, ":host");
          return `<style>${modifiedCss}</style>`;
        }
      );
      // Assign the modified HTML to the shadow root
      shadowRef.current.innerHTML = newHtml;
    }
  }, [html]);

  return <div ref={containerRef} />;
}
