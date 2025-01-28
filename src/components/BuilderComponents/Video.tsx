import { Props } from "@/utils/Types";

const Video = ({ style, src, width, height }: Props) => {
  return (
    <div className="max-w-full" style={style}>
      <video controls style={{ width, height }}>
        <source src={src}></source>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
