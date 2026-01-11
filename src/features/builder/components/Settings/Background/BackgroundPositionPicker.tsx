import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import {
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import "./BackgroundPositionPicker.css";
import { HandleChangeType, OptionsObject } from "@/utils/Types";
import Select from "@/components/Select";

const type = "background-position";

export const BackgroundPositionPicker = () => {
  const positionStr = getSetting(useAppSelector, type) || "50% 50%"; // "50% 50%"
  const backgroundSize = getSetting(useAppSelector, "background-size");
  const backgroundRepeat = getSetting(useAppSelector, "background-repeat");
  const backgroundImage = getSetting(useAppSelector, "background-image");
  const isCover = backgroundSize === "cover"; //background-position behaves differently based on if bg-size is cover or contain

  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const position = positionStr.split(" ").map((str) => parseFloat(str));

  const updateFromEvent = (x: number, y: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = snapToAnchor(((x - rect.left) / rect.width) * 100);
    const yPercent = snapToAnchor(((y - rect.top) / rect.height) * 100);

    const regulatedXPercent = isCover ? xPercent : 100 - xPercent;
    const regulatedYPercent = isCover ? yPercent : 100 - yPercent;

    dispatch(
      changeElementStyle({
        types: ["background-position"],
        newValue: `${regulatedXPercent}% ${regulatedYPercent}%`,
      })
    );
  };

  const startDrag = (e: React.MouseEvent) => {
    updateFromEvent(e.clientX, e.clientY);
    const move = (ev: MouseEvent) => updateFromEvent(ev.clientX, ev.clientY);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const startTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    updateFromEvent(touch.clientX, touch.clientY);

    const move = (ev: TouchEvent) => {
      const touchMove = ev.touches[0];
      updateFromEvent(touchMove.clientX, touchMove.clientY);
    };
    const end = () => {
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
  };

  const position0 = isCover ? position[0] : 100 - position[0];
  const position1 = isCover ? position[1] : 100 - position[1];

  return (
    <>
      <p className="text-sm font-medium mb-2">Background Position</p>
      <div className="flex justify-center">
        <div>
          <div
            ref={containerRef}
            className="bg-position-picker bg-text flex-[0_0_auto] me-2"
            onMouseDown={startDrag}
            onTouchStart={startTouch}
            style={{
              backgroundImage,
              backgroundRepeat,
              backgroundSize,
              backgroundPosition: "center center",
            }}
          >
            <div className="snap-line vertical left" />
            <div className="snap-line vertical center" />
            <div className="snap-line vertical right" />
            <div className="snap-line horizontal top" />
            <div className="snap-line horizontal center" />
            <div className="snap-line horizontal bottom" />
            <div
              className="bg-position-dot"
              style={{
                left: `${position0}%`,
                top: `${position1}%`,
              }}
              title={`${position0.toFixed(0)}%, ${position1.toFixed(0)}%`}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="text-background bg-gray p-1 rounded cursor-pointer my-1"
              onClick={() =>
                dispatch(
                  changeElementStyle({
                    types: ["background-position"],
                    newValue: "50% 50%",
                  })
                )
              }
            >
              Center
            </button>
          </div>
        </div>
        <Alignment isCover={isCover} />
      </div>
    </>
  );
};

const Alignment = ({ isCover }: { isCover: boolean }) => {
  const positionStr = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  const handleChange: HandleChangeType = (e, i) => {
    const newValue = setValueFromShorthandStr(positionStr, i, e.target.value);

    dispatch(
      changeElementStyle({
        types: [type],
        newValue,
      })
    );
  };

  return (
    <div className="flex flex-col">
      <VerticalOrHorizontal
        type="horizontal"
        options={[
          { value: isCover ? "0%" : "100%", title: "left" },
          { value: "50%", title: "center" },
          { value: isCover ? "100%" : "0%", title: "right" },
        ]}
        onChange={(e) => handleChange(e, 0)}
        value={getValueFromShorthandStr(positionStr, 0)}
      />
      <VerticalOrHorizontal
        type="vertical"
        options={[
          { value: isCover ? "0%" : "100%", title: "top" },
          { value: "50%", title: "center" },
          { value: isCover ? "100%" : "0%", title: "bottom" },
        ]}
        onChange={(e) => handleChange(e, 1)}
        value={getValueFromShorthandStr(positionStr, 1)}
      />
    </div>
  );
};

const VerticalOrHorizontal = ({
  type,
  onChange,
  value,
  options,
}: {
  type: string;
  onChange: HandleChangeType;
  value: string;
  options: OptionsObject[];
}) => {
  return (
    <Select
      title={"Select " + type + " focus point"}
      options={options}
      selected={value}
      onChange={onChange}
    />
  );
};

const snapToAnchor = (val: number) => {
  const anchors = [0, 50, 100];
  const threshold = 5;
  for (const anchor of anchors) {
    if (Math.abs(val - anchor) <= threshold) {
      return anchor;
    }
  }
  return val;
};
