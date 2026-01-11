const WrapperWithBottomLine = ({
  children,
  flex = false,
}: {
  children: React.ReactNode;
  flex?: boolean;
}) => {
  return (
    <div
      className={
        "relative pb-2 mb-2 " + (flex ? "flex flex-col items-center" : "")
      }
    >
      {children}
      <div className="absolute left-0 bottom-0 w-full h-[2px] bg-text rounded"></div>
    </div>
  );
};

export default WrapperWithBottomLine;
