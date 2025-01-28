import { Props } from "@/utils/Types";

const Audio = ({ style, src }: Props) => {
  return (
    <div style={style}>
      <audio controls>
        <source src={src}></source>
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default Audio;
