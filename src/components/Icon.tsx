const Icon = ({
  type,
  size,
  onClick,
  className,
}: {
  type: string;
  size: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <i
      className={`bi bi-${type} cursor-pointer ${className}`}
      style={{ fontSize: size }}
      onClick={onClick}
    ></i>
  );
};

export default Icon;
