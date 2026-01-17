import MiniLoadingSvg from "./MiniLoadingSvg";

const ButtonWithLoading = ({
  onClick,
  type = "amber",
  loading = false,
  text,
}: {
  onClick: () => void;
  text: string;
  type?: string;
  loading?: boolean;
}) => {
  const cls = type === "red" ? "bg-deleteRed text-white" : "bg-amber";
  return (
    <button
      disabled={loading}
      className={"p-1 text-black rounded cursor-pointer " + cls}
      onClick={onClick}
    >
      {loading ? <MiniLoadingSvg /> : <> {text}</>}
    </button>
  );
};

export default ButtonWithLoading;
