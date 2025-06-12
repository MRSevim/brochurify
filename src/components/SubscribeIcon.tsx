import { useSubscribePopup } from "@/contexts/SubscribePopupContext";
import Icon from "./Icon";

const SubscribeIcon = () => {
  const [, , setPopup] = useSubscribePopup();
  return (
    <Icon
      type="stars"
      size="24px"
      title="Subscribe Icon"
      onClick={() => {
        setPopup(true);
      }}
    />
  );
};

export default SubscribeIcon;
