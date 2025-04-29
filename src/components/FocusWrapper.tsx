import {
  setActive,
  setCopied,
  setDraggedItem,
  setDropHandled,
  setHovered,
} from "@/redux/slices/editorSlice";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  const activeId = useAppSelector(selectActive)?.id;
  const dropHandled = useAppSelector((state) => state.editor.dropHandled);

  return (
    <div
      className="cursor-pointer w-full h-full"
      key={itemId}
      draggable
      onMouseOver={(e) => {
        e.stopPropagation();
        dispatch(setHovered(itemId));
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        dispatch(setHovered(undefined));
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        dispatch(setDropHandled(false));
        dispatch(setDraggedItem(itemId));
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        dispatch(setDraggedItem(undefined));
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
    >
      {children}
    </div>
  );
};

export default FocusWrapper;
