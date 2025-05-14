import DeleteButton from "../DeleteButton";
import EditButton from "../EditButton";

const EditableListItem = ({
  onEditClick,
  onDeleteClick,
  children,
  i,
}: {
  onEditClick: (i: number) => void;
  onDeleteClick: (i: number) => void;
  children: React.ReactNode;
  i: number;
}) => {
  return (
    <div
      key={i}
      className="flex justify-between items-center border border-text p-2 m-2"
    >
      <div className="px-2">{children}</div>
      <div className="flex gap-1">
        <EditButton onClick={() => onEditClick(i)} />
        <DeleteButton onClick={() => onDeleteClick(i)} />
      </div>
    </div>
  );
};

export default EditableListItem;
