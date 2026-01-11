import DeleteButton from "../../../../../components/DeleteButton";
import EditButton from "../../../../../components/EditButton";

const EditableListItem = ({
  onEditClick,
  onDeleteClick,
  showEditButton = true,
  children,
}: {
  onEditClick: () => void;
  onDeleteClick: () => void;
  showEditButton?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center border border-text p-2 m-2">
      <div className="px-2">{children}</div>
      <div className="flex gap-1">
        {showEditButton && <EditButton onClick={onEditClick} />}
        <DeleteButton onClick={onDeleteClick} />
      </div>
    </div>
  );
};

export default EditableListItem;
