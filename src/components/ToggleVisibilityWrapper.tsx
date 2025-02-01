import { useState } from "react";
import Icon from "./Icon";

type Props = { children: React.ReactNode; title: String };

const ToggleVisibilityWrapper = ({ children, title }: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-between font-medium text-lg text-light mb-2 items-center border border-light rounded p-2">
        <h2>{title}</h2>
        <ToggleButton
          onClick={() => setVisible((prev) => !prev)}
          toggled={visible}
        />
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
