const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-8 text-black ">
      <div className="mx-auto px-4 max-w-7xl">{children}</div>
    </div>
  );
};

export default Container;
