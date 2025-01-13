const Column = ({ children }: { children: React.ReactNode }) => {
  if (children) {
    return <div className="bg-red-500">{children}</div>;
  }
};

export default Column;
