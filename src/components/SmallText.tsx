import { memo } from "react";

const SmallText = memo(({ text }: { text: string }) => {
  return <p className="font-light text-sm text-center">{text} </p>;
});

export default SmallText;
