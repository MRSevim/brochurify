import { useLightMode } from "@/contexts/DarkModeContext";
import Icon from "./Icon";
import ToggleBtn from "./ToggleBtn";

const DarkModeToggle = () => {
  const [lightMode, setLightMode] = useLightMode();
  return (
    <div className="flex items-center me-5">
      <ToggleBtn
        text={
          <Icon
            title="Settings"
            type={!lightMode ? "moon-fill" : "moon"}
            size="22px"
            onClick={() => {}}
          />
        }
        checked={!lightMode}
        onChange={() => setLightMode((prev) => !prev)}
      />
    </div>
  );
};

export default DarkModeToggle;
