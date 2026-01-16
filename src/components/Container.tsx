const Container = ({
  children,
  isMain = true,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  isMain?: boolean;
}) => {
  if (isMain) {
    return (
      <main
        className={"mx-auto px-4 my-8 max-w-7xl flex-1 " + `${className ?? ""}`}
      >
        {children}
      </main>
    );
  } else {
    return (
      <div className={"mx-auto flex-1 px-4 max-w-7xl " + `${className ?? ""}`}>
        {children}
      </div>
    );
  }
};

export default Container;
