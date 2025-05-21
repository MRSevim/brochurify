import React from "react";
import SmallText from "./SmallText";

const SpeechBubble = ({ text }: { text: React.ReactNode }) => {
  return (
    <div
      className="opacity-0 transition-all duration-300 info-text absolute right-0 top-full
            pointer-events-none px-4 py-2 bg-zinc-800 text-white rounded w-[200px]
            z-50
            before:absolute before:content-[''] before:w-0 before:h-0 before:border-8 before:border-transparent before:border-b-zinc-800 before:right-0 before:bottom-full"
    >
      <SmallText>{text}</SmallText>
    </div>
  );
};

export default SpeechBubble;
