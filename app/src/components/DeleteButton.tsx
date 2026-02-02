import { memo } from "react";
import Icon from "./Icon";
import MiniLoadingSvg from "./MiniLoadingSvg";

const DeleteButton = memo(
  ({
    onClick,
    loading = false,
  }: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    loading?: boolean;
  }) => {
    return (
      <button className="bg-deleteRed p-1 rounded text-white" onClick={onClick}>
        {loading && <MiniLoadingSvg />}
        {!loading && <Icon type="trash-fill" size="20px" title="Delete" />}
      </button>
    );
  }
);
export default DeleteButton;
