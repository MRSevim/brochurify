import { Props } from "@/utils/Types";

const Row = ({ children, style }: Props) => {
  return (
    <div className="flex" style={style}>
      {children}
    </div>
  );
};

export default Row;
