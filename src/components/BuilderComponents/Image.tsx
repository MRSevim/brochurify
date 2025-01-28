import { Props } from "@/utils/Types";

const Image = ({ style, src, width, height }: Props) => {
  return (
    <div className="max-w-full" style={style}>
      <img src={src} style={{ width, height }}></img>
    </div>
  );
};

export default Image;
