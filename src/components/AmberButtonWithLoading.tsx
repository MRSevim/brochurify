import MiniLoadingSvg from "./MiniLoadingSvg";

const AmberButtonWithLoading = ({
  onClick,
  loading = false,
  text,
}: {
  onClick: () => void;
  text: string;
  loading?: boolean;
}) => {
  return (
    <button
      className="p-1 text-black bg-amber rounded cursor-pointer"
      onClick={onClick}
    >
      {loading ? <MiniLoadingSvg /> : <> {text}</>}
    </button>
  );
};

export default AmberButtonWithLoading;
