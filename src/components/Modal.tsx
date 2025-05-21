export const Modal = ({
  onClose,
  children,
  title,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[110]">
    <div className="rounded-lg shadow-lg w-11/12 max-w-5xl relative">
      <button
        onClick={onClose}
        className="absolute top-2 text-deleteRed bg-[rgb(107,114,128)]/50 rounded right-3 z-[120] text-3xl p-1 px-3 rounded-full hover:bg-[rgb(107,114,128)]/100 transition"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold left-3 top-2 absolute bg-[rgb(107,114,128)]/50 rounded z-[120] p-1 backdrop-blur-sm ">
        {title}
      </h2>
      {children}
    </div>
  </div>
);
