import React from "react";
import SpeechBubble from "./SpeechBubble";

const InfoIcon = ({ text }: { text: React.ReactNode }) => {
  return (
    <i
      className="bi bi-info-circle info-icon relative"
      style={{ fontSize: "16px" }}
    >
      <SpeechBubble text={text} />
    </i>
  );
};

export default InfoIcon;
