const Icon = ({
  type,
  size,
  onClick,
  className,
  title,
}: {
  type: string;
  size: string;
  title: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <i
      className={`bi bi-${type} cursor-pointer ${className}`}
      style={{ fontSize: size }}
      onClick={onClick}
      title={title}
    ></i>
  );
};

export default Icon;
