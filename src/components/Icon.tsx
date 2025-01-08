const Icon = ({ type, size }: { type: string; size: string }) => {
  return (
    <i
      className={`bi bi-${type} cursor-pointer`}
      style={{ fontSize: size }}
    ></i>
  );
};

export default Icon;
