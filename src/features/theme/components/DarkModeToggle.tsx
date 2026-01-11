import { useLightMode } from "@/features/theme/utils/DarkModeContext";
import Icon from "../../../components/Icon";
import ToggleBtn from "../../../components/ToggleBtn";

const DarkModeToggle = () => {
  const [lightMode, setLightMode] = useLightMode();
  return (
    <div className="flex items-center">
      <ToggleBtn
        text={
          <Icon
            title="Dark/Light Mode Switch"
            type={!lightMode ? "moon-fill" : "moon"}
            size="24px"
          />
        }
        checked={!lightMode}
        onChange={() => setLightMode((prev) => !prev)}
      />
    </div>
  );
};

export default DarkModeToggle;
