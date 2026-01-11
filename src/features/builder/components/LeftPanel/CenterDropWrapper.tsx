import { Layout } from "@/utils/Types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useAddSectionToggleSetter } from "@/features/builder/utils/contexts/AddSectionToggleContext";
import { setActive } from "@/features/builder/lib/redux/slices/editorSlice";
import { useVisibilityMapSetter } from "./VisibilityMapContext";
import {
  selectActive,
  selectAddLocation,
  selectDraggedOver,
  selectHovered,
  selectLayout,
} from "../../lib/redux/selectors";

const CenterDropWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const activeId = useAppSelector(selectActive);
  const setVisibilityMap = useVisibilityMapSetter();
  const addLocation = useAppSelector(selectAddLocation);
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);
  const setToggle = useAddSectionToggleSetter();
  const itemDraggedOver = useAppSelector(selectDraggedOver);
  const draggingOver = itemDraggedOver?.id === id && !itemDraggedOver.where;
  const itemHovered = useAppSelector(selectHovered);
  const hovered = itemHovered?.id === id && !itemHovered.where;
  const active = activeId === id || draggingOver || hovered;

  useEffect(() => {
    const reveal = (activeId: string | undefined, layout: Layout[]) => {
      if (!activeId) return;

      const getParentIds = (
        id: string,
        layout: Layout[],
        parents: string[] = []
      ): string[] => {
        for (const item of layout) {
          if (item.id === id) return parents;

          if (item.props.child) {
            const found = getParentIds(id, item.props.child, [
              ...parents,
              item.id,
            ]);
            if (found.length) return found;
          }
        }
        return [];
      };

      const parentIds = getParentIds(activeId, layout);

      setVisibilityMap((prevMap) => {
        const newMap = new Map(prevMap);
        parentIds.forEach((parentId) => newMap.set(parentId, true));
        return newMap;
      });
    };

    reveal(activeId, layout);
    reveal(addLocation?.id, layout);
  }, [activeId, addLocation]);
  return (
    <div
      className={
        "p-1 border flex items-center justify-between relative " +
        (active ? "border-positiveGreen" : "border-gray")
      }
    >
      {" "}
      <div
        onClick={(e) => {
          setToggle(true);
          dispatch(setActive(id));
          e.stopPropagation();
        }}
        className="z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-hoveredBlue opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        +
      </div>
      {children}
    </div>
  );
};
export default CenterDropWrapper;
