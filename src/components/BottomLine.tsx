import { memo } from "react";

const BottomLine = memo(() => {
  return (
    <div className="absolute left-0 bottom-0 w-full h-[2px] bg-text rounded"></div>
  );
});

export default BottomLine;
