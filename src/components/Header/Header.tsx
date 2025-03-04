"use client";
import { useAppDispatch } from "@/redux/hooks";
import DarkModeToggle from "../DarkModeToggle";
import Icon from "../Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { redo, resetToInitial, undo } from "@/redux/slices/editorSlice";
import SavePopupWrapper from "./SavePopupWrapper";
import { useViewMode } from "@/contexts/ViewModeContext";
import { useState } from "react";
import Link from "next/link";
import { triggerReplay } from "@/redux/slices/replaySlice";
import DownloadWrapper from "./DownloadWrapper";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full h-10 bg-background px-3 flex items-center justify-between">
      {pathname === "/builder" ? <BuilderHeader /> : <GeneralHeader />}
    </header>
  );
};

const GeneralHeader = () => {
  return (
    <>
      <div>
        <Link href="/">
          <p className="font-bold text-lg"> Brochurify</p>
        </Link>
      </div>
      <div>
        <Link href="/how-to">
          <span>How To</span>
        </Link>
      </div>
    </>
  );
};

const BuilderHeader = () => {
  return (
    <>
      <LeftSide />
      <RightSide />
    </>
  );
};

const LeftSide = () => {
  const [, setLayoutToggle] = LayoutToggleContext.Use();
  const [mobileActionsToggle, setMobileActionsToggle] = useState(false);

  return (
    <div className="flex items-center ">
      <div className="me-3 md:me-6">
        <Icon
          title="Layout"
          type="list-nested"
          size="28px"
          onClick={() => setLayoutToggle((prev) => !prev)}
        />
      </div>
      <div className="relative md:hidden block">
        <Icon
          title="mobile-actions-toggle"
          type="chevron-double-down"
          size="24px"
          onClick={() => setMobileActionsToggle((prev) => !prev)}
        />
        {mobileActionsToggle && (
          <div className="absolute bg-background p-3 border rounded z-[70]">
            <LeftSideActions />
          </div>
        )}
      </div>
      <div className="items-center gap-2 hidden md:flex">
        <LeftSideActions />
      </div>
      <SavePopupWrapper />
    </div>
  );
};

const LeftSideActions = () => {
  const dispatch = useAppDispatch();
  return (
    <>
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
      <Icon
        title="Reset to initial"
        type="x-octagon"
        size="24px"
        onClick={() => dispatch(resetToInitial())}
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
      <DownloadWrapper />
    </>
  );
};

const RightSide = () => {
  const [, setSettingsToggle] = SettingsToggleContext.Use();
  return (
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
      className="relative z-[70]"
      onClick={() => setChanging((prev) => !prev)}
    >
      <Icon title="View mode" type={type} size="24px" onClick={() => {}} />
      {changing && (
        <div className="absolute border border-text p-2 rounded bg-background top-full left-1/2 -translate-x-1/2 items-center flex flex-col">
          {Icons.map((icon) => (
            <div
              key={icon.title}
              className="hover:shadow-sm hover:shadow-text hover:z-50 p-2 cursor-pointer"
              onClick={() => {
                setViewMode(icon.title);
              }}
            >
              <Icon
                title={icon.title}
                type={icon.type}
                size="20px"
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
