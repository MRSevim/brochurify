import {
  useViewModeSetter,
  useViewModeState,
} from "@/contexts/ViewModeContext";
import Icon from "../Icon";
import { FaDesktop } from "react-icons/fa";
import { capitalizeFirstLetter } from "@/utils/Helpers";

const Icons = ["desktop", "tablet", "phone"];

const ViewMode = () => {
  const viewMode = useViewModeState();
  const setViewMode = useViewModeSetter();

  return (
    <div className="flex gap-2">
      {Icons.map((icon) => (
        <div
          key={icon}
          className={
            "p-2 cursor-pointer flex items-center " +
            (viewMode === icon ? "bg-text rounded text-background" : "")
          }
          onClick={() => {
            setViewMode(icon);
          }}
        >
          {icon === "desktop" ? (
            <FaDesktop
              className="text-[24px]"
              title={capitalizeFirstLetter(icon)}
            />
          ) : (
            <Icon
              title={capitalizeFirstLetter(icon)}
              type={icon}
              size="24px"
              onClick={() => {}}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default ViewMode;
