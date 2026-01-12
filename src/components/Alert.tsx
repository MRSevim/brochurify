const Alert = ({
  text,
  className,
  type = "success",
}: {
  text: string;
  className?: string;
  type?: "success" | "error";
}) => {
  let cls = "";
  if (type === "success") {
    cls = "text-green-800 bg-green-200 dark:bg-gray-800 dark:text-green-400";
  } else if (type === "error") {
    cls = "text-red-800 bg-red-200 dark:bg-gray-800 dark:text-red-600";
  }
  return (
    <div className={"p-1 text-sm rounded-lg " + cls + className} role="alert">
      <span className="font-small">{text}</span>
    </div>
  );
};

export default Alert;
