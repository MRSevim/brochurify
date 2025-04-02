import { useState } from "react";
import Icon from "./Icon";
import InfoIcon from "./InfoIcon";

type Props = { children: React.ReactNode; title: string; desc?: string };

const ToggleVisibilityWrapper = ({ children, title, desc }: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-between font-medium text-lg text-light mb-2 items-center border border-text rounded p-2">
        <h2>{title}</h2>
        <div className="flex items-center">
          {desc && <InfoIcon text={desc} />}
          <ToggleButton
            onClick={() => setVisible((prev) => !prev)}
            toggled={visible}
          />
        </div>
      </div>
      {visible && children}
    </>
  );
};
const ToggleButton = ({
  onClick,
  toggled,
}: {
  onClick: () => void;
  toggled: boolean;
}) => {
  const type = toggled ? "chevron-up" : "chevron-down";
  return (
    <button className="p-1" onClick={onClick}>
      <Icon type={type} size="20px" title="Toggle" />
    </button>
  );
};
export default ToggleVisibilityWrapper;
