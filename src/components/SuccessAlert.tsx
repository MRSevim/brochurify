const SuccessAlert = ({ text }: { text: string }) => {
  return (
    <div
      className="p-1 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <span className="font-small">{text}</span>
    </div>
  );
};

export default SuccessAlert;
