const Container = ({
  children,
  addBottomMargin = true,
  pushedVertically = true,
}: {
  children: React.ReactNode;
  addBottomMargin?: boolean;
  pushedVertically?: boolean;
}) => {
  if (pushedVertically) {
    return (
      <div className="my-8 text-black flex-1">
        <div
          className={
            "mx-auto px-4 max-w-7xl " + (addBottomMargin ? "mb-3" : "")
          }
        >
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={
          "mx-auto flex-1 px-4 max-w-7xl " + (addBottomMargin ? "mb-3" : "")
        }
      >
        {children}
      </div>
    );
  }
};

export default Container;
