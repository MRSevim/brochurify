const Icon = ({ type, size }: { type: String; size: String }) => {
  return <i className={`bi bi-${type} cursor-pointer text-${size}`}></i>;
};

export default Icon;
