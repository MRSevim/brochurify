import DeleteButton from "../DeleteButton";
import EditButton from "../EditButton";

const EditableList = ({
  onEditClick,
  onDeleteClick,
  items,
  name,
}: {
  onEditClick: (i: number) => void;
  onDeleteClick: (i: number) => void;
  items: string[];
  name: string;
}) => {
  return (
    <div className="mt-2 w-full">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border border-text p-2 m-2"
        >
          <div className="px-2">
            <span className="pe-2 border-r-2">
              {name} {i + 1}
            </span>
          </div>
          <div className="flex gap-1">
            <EditButton onClick={() => onEditClick(i)} />
            <DeleteButton onClick={() => onDeleteClick(i)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditableList;
