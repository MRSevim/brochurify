import DeleteButton from "../DeleteButton";
import EditButton from "../EditButton";

const EditableListItem = ({
  onEditClick,
  onDeleteClick,
  children,
}: {
  onEditClick: () => void;
  onDeleteClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center border border-text p-2 m-2">
      <div className="px-2">{children}</div>
      <div className="flex gap-1">
        <EditButton onClick={onEditClick} />
        <DeleteButton onClick={onDeleteClick} />
      </div>
    </div>
  );
};

export default EditableListItem;
