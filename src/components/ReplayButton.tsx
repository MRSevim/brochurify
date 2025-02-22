import Icon from "./Icon";

const ReplayButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center mb-2">
      <button
        className="p-1 text-background bg-gray rounded cursor-pointer flex items-center gap-2"
        onClick={onClick}
      >
        {" "}
        <Icon title="Replay" type="play-circle-fill" size="20px" />
        Replay
      </button>
    </div>
  );
};
export default ReplayButton;
