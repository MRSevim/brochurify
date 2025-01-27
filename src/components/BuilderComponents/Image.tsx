import { Props } from "@/utils/Types";

const Image = ({ style, src, width, height }: Props) => {
  return (
    <section className="max-w-full" style={style}>
      <img src={src} style={{ width, height }}></img>
    </section>
  );
};

export default Image;
