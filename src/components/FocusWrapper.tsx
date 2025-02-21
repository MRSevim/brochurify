import {
  setActive,
  setCopied,
  setDraggedItem,
  setDropHandled,
} from "@/redux/slices/editorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { Layout } from "@/utils/Types";

const FocusWrapper = ({
  item,
  children,
}: {
  item: Layout;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const itemId = item?.id;
  const activeId = useAppSelector((state) => state.editor.active?.id);
  const dropHandled = useAppSelector((state) => state.editor.dropHandled);

  return (
    <div
      className="cursor-pointer w-full h-full"
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
        e.preventDefault();
        e.stopPropagation();
        if (activeId === itemId) {
          dispatch(setActive(undefined));
        } else dispatch(setActive(item));
      }}
      onCopy={(e) => {
        e.stopPropagation();
        dispatch(setCopied(item));
      }}
    >
      {children}
    </div>
  );
};

export default FocusWrapper;
