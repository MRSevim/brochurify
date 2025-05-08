import Icon from "./Icon";

const EditButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button className="bg-amberVar p-1 rounded" onClick={onClick}>
      <Icon type="pencil-fill" size="20px" title="Edit" />
    </button>
  );
};
export default EditButton;
