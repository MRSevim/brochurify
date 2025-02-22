"use client";
import { useAppDispatch } from "@/redux/hooks";
import DarkModeToggle from "../DarkModeToggle";
import Icon from "../Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { redo, undo } from "@/redux/slices/editorSlice";
import SavePopupWrapper from "./SavePopupWrapper";
import { useViewMode } from "@/contexts/ViewModeContext";
import { useState } from "react";
import Link from "next/link";
import { triggerReplay } from "@/redux/slices/replaySlice";

const Header = () => {
  const [, setLayoutToggle] = LayoutToggleContext.Use();
  const [, setSettingsToggle] = SettingsToggleContext.Use();

  const dispatch = useAppDispatch();

  return (
    <header className="w-full h-10 bg-background px-2 flex items-center justify-between">
      <div className="flex items-center">
        <div className="me-6">
          <Icon
            title="Layout"
            type="list-nested"
            size="28px"
            onClick={() => setLayoutToggle((prev) => !prev)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Icon
            title="Undo"
            type="arrow-counterclockwise"
            size="24px"
            onClick={() => dispatch(undo())}
          />
          <Icon
            title="Redo"
            type="arrow-clockwise"
            size="24px"
            onClick={() => dispatch(redo())}
          />
          <Icon
            title="Replay"
            type="play-circle"
            size="24px"
            onClick={() => dispatch(triggerReplay())}
          />
          <ViewMode />
          <Link href="/preview" target="_blank">
            <Icon
              title="Preview the page"
              type="eye-fill"
              size="24px"
              onClick={() => {}}
            />
          </Link>
        </div>
        <SavePopupWrapper />
      </div>

      <div className="flex items-center">
        <DarkModeToggle />
        <Icon
          title="Settings"
          type="gear-fill"
          size="25px"
          onClick={() => {
            setSettingsToggle((prev) => !prev);
          }}
        />
      </div>
    </header>
  );
};

const ViewMode = () => {
  const [viewMode, setViewMode] = useViewMode();
  const [changing, setChanging] = useState(false);
  const type =
    viewMode === "desktop"
      ? "window-fullscreen"
      : viewMode === "tablet"
      ? "tablet-fill"
      : "phone-fill";

  const Icons = [
    { title: "desktop", type: "window-fullscreen" },
    { title: "tablet", type: "tablet-fill" },
    { title: "mobile", type: "phone-fill" },
  ];

  return (
    <div
      className="relative z-[60]"
      onClick={() => setChanging((prev) => !prev)}
    >
      <Icon title="View mode" type={type} size="24px" onClick={() => {}} />
      {changing && (
        <div className="absolute border border-text p-2 rounded bg-background top-full left-1/2 -translate-x-1/2 items-center flex flex-col">
          {Icons.map((icon) => (
            <div
              key={icon.title}
              className="hover:shadow-sm hover:shadow-text hover:z-50 p-2"
            >
              <Icon
                title={icon.title}
                type={icon.type}
                size="20px"
                onClick={() => {
                  setViewMode(icon.title);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
