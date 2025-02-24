import Icon from "./Icon";

const EditButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button className="bg-amber-800 p-1 rounded" onClick={onClick}>
      <Icon type="pencil-fill" size="20px" title="Delete" />
    </button>
  );
};
export default EditButton;
