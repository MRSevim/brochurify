import Icon from "./Icon";
import MiniLoadingSvg from "./MiniLoadingSvg";

const EditButton = ({
  editing = false,
  loading = false,
  onClick,
}: {
  editing?: boolean;
  loading?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      disabled={loading}
      className="bg-amber text-black p-1 rounded edit-button"
      onClick={onClick}
    >
      {loading && <MiniLoadingSvg />}
      {!loading && (
        <>
          {editing ? (
            "Save"
          ) : (
            <Icon type="pencil-fill" size="20px" title="Edit" />
          )}
        </>
      )}
    </button>
  );
};
export default EditButton;
