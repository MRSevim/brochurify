import {
  setActive,
  setDraggedItem,
  setDropHandled,
} from "@/redux/slices/editorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";

const FocusWrapper = ({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.editor.active);
  const dropHandled = useAppSelector((state) => state.editor.dropHandled);
  return (
    <section
      className="cursor-pointer"
      key={itemId}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        dispatch(setDropHandled(false));
        dispatch(setDraggedItem(itemId));
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
