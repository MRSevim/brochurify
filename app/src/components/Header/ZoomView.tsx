import { useZoom } from "@/features/builder/utils/contexts/ZoomContext";
import React, { useState } from "react";
import Icon from "../Icon";

const percentages = [0, 25, 50, 75];

const ZoomView = () => {
  const [zoom, setZoom] = useZoom();
  const [toggled, setToggled] = useState(false);

  return (
    <div className="relative">
      <Icon
        type="zoom-out"
        size="24px"
        title="Zoom out"
        onClick={() => setToggled((prev) => !prev)}
      />
      {toggled && (
        <div className="absolute right-0 top-full bg-background rounded border border-text z-[100]">
          {percentages.map((percentage) => (
            <div
              key={percentage}
              className={
                "px-4 py-2 cursor-pointer" +
                (zoom === percentage ? " bg-text text-background" : "")
              }
              onClick={() => setZoom(percentage)}
            >
              -{percentage}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoomView;
