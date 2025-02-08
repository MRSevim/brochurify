"use client";
import DarkModeToggle from "./DarkModeToggle";
import Icon from "./Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";

const Header = () => {
  const [, setLayoutToggle] = LayoutToggleContext.Use();
  const [, setSettingsToggle] = SettingsToggleContext.Use();
  return (
    <header className="w-full h-10 bg-background px-2 flex items-center justify-between">
      <Icon
        title="Layout"
        type="list-nested"
        size="28px"
        onClick={() => setLayoutToggle((prev) => !prev)}
      />

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
