const Container = ({
  children,
  pushedVertically = true,
}: {
  children: React.ReactNode;
  pushedVertically?: boolean;
}) => {
  if (pushedVertically) {
    return (
      <div className="my-8 text-black ">
        <div className="mx-auto px-4 max-w-7xl">{children}</div>
      </div>
    );
  } else {
    return <div className="mx-auto px-4 max-w-7xl">{children}</div>;
  }
};

export default Container;
