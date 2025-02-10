import Icon from "./Icon";

const DeleteButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button className="bg-red-800 p-1 rounded" onClick={onClick}>
      <Icon type="trash-fill" size="20px" title="Delete" />
    </button>
  );
};
export default DeleteButton;
