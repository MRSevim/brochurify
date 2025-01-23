"use client";
import Icon from "./Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";

const Header = () => {
  const [, setLayoutToggle] = LayoutToggleContext.Use();
  const [, setSettingsToggle] = SettingsToggleContext.Use();
  return (
    <header className="w-full h-10 bg-dark text-light px-2 flex items-center justify-between">
      <span onClick={() => setLayoutToggle((prev) => !prev)}>
        <Icon type="list-nested" size="28px" />
      </span>

      <span
        onClick={() => {
          setSettingsToggle((prev) => !prev);
        }}
      >
        <Icon type="gear-fill" size="25px" />
      </span>
    </header>
  );
};

export default Header;
