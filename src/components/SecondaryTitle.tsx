const SecondaryTitle = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center mb-1">
      <h3 className="font-medium text-light ">{title}</h3>
      {children}
    </div>
  );
};

export default SecondaryTitle;
