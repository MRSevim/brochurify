"use client";
import { useAppDispatch } from "@/redux/hooks";
import DarkModeToggle from "./DarkModeToggle";
import Icon from "./Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import { redo, undo } from "@/redux/slices/editorSlice";

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
            title="View mode"
            type="window-fullscreen"
            size="24px"
            onClick={() => {}}
          />
          <Icon
            title="View the generated page"
            type="eye fill"
            size="24px"
            onClick={() => {}}
          />
        </div>
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

export default Header;
