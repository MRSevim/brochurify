import BottomLine from "./BottomLine";

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
      <BottomLine />
    </div>
  );
};

export default WrapperWithBottomLine;
