import {
  handleDrop,
  setActive,
  setDraggedItem,
  setDraggedOver,
  setHovered,
} from "@/redux/slices/editorSlice";
import {
  selectActive,
  selectDraggedOver,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

const FocusWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActive);
  const itemDraggedOver = useAppSelector(selectDraggedOver);
  const draggingOver = itemDraggedOver?.id === id && !itemDraggedOver.where;
  const draggingOverSideDrop = itemDraggedOver?.id && itemDraggedOver.where;

  return (
    <div
      className="cursor-pointer w-full h-full"
      key={id}
      draggable
      onMouseOver={(e) => {
        e.stopPropagation();
        dispatch(setHovered({ id }));
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        dispatch(setHovered(undefined));
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        dispatch(setDraggedItem(id));
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        dispatch(setDraggedItem(undefined));
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(setDraggedOver(undefined));
        dispatch(handleDrop({ targetId: id, addLocation: null }));
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!draggingOver && !draggingOverSideDrop)
          dispatch(setDraggedOver({ id: id }));
      }}
      onDragLeave={() => {
        dispatch(setDraggedOver(undefined));
      }}
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeId === id) {
          dispatch(setActive(undefined));
        } else dispatch(setActive(id));
      }}
    >
      {children}
    </div>
  );
};
export default FocusWrapper;
