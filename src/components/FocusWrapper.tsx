import { setActive } from "@/redux/slices/editorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { SetStateAction, Dispatch } from "react";

const FocusWrapper = ({
  itemId,
  children,
  dropHandled,
  setDropHandled,
}: {
  itemId: string;
  children: React.ReactNode;
  dropHandled: boolean;
  setDropHandled: Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.editor.active);
  return (
    <section
      className="cursor-pointer"
      key={itemId}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("id", itemId);
        setDropHandled(false);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        if (!dropHandled) {
          toast.error("You cannot drop there");
        }
      }}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (active === itemId) {
          dispatch(setActive(undefined));
        } else dispatch(setActive(itemId));
      }}
    >
      {children}
    </section>
  );
};

export default FocusWrapper;
