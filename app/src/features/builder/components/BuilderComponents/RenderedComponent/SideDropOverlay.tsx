import { useAddSectionToggleSetter } from "@/features/builder/utils/contexts/AddSectionToggleContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  handleDrop,
  setAddLocation,
  setDraggedOver,
  setHovered,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { Style, Where } from "@/features/builder/utils/types/types.d";
import { DragEvent, memo } from "react";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import EditorActions from "./EditorActions";
import {
  selectActive,
  selectAddLocation,
  selectDraggedOver,
  selectHovered,
} from "@/features/builder/lib/redux/selectors";

export const SideDropOverlay = ({
  id,
  type,
  style,
  children,
  ref,
}: {
  id: string;
  type: string;
  style: Style;
  ref: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) => {
  const notFixed = type !== "fixed";
  const active = useAppSelector(selectActive) === id;

  return (
    <styledElements.styledComponentWrapperDiv
      className={"block " + (notFixed && "relative")}
      $styles={style}
      $type={type}
      ref={ref}
    >
      {notFixed && <SideDropZone id={id} where="before" />}
      {active && <EditorActions id={id} type={type} />}
      {children}
      {notFixed && <SideDropZone id={id} where="after" />}
    </styledElements.styledComponentWrapperDiv>
  );
};

const SideDropZone = memo(({ where, id }: { id: string; where: Where }) => {
  const second = where === "after";
  const addLocation = useAppSelector(selectAddLocation);
  const selected = addLocation?.id === id && addLocation?.where === where;
  const itemDraggedOver = useAppSelector(selectDraggedOver);
  const draggingOver =
    itemDraggedOver?.id === id && itemDraggedOver.where === where;
  const itemHovered = useAppSelector(selectHovered);
  const hovered = itemHovered?.id === id && itemHovered.where === where;
  const commonClasses =
    "cursor-pointer absolute flex justify-center align-center opacity-0 transition-opacity duration-200 z-[60] ";
  const extraClasses =
    selected || draggingOver
      ? "opacity-100 bg-activeBlue"
      : hovered
        ? " opacity-100 bg-hoveredBlue"
        : "";

  const dispatch = useAppDispatch();
  const setToggle = useAddSectionToggleSetter();

  const handleAddLocationClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (addLocation && addLocation.id === id && addLocation.where === where) {
      dispatch(setAddLocation(null));
    } else {
      dispatch(setAddLocation({ id, where }));
      setToggle(true);
    }
  };

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(
      handleDrop({
        targetId: undefined,
        addLocation: {
          id,
          where,
        },
      }),
    );
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!draggingOver) {
          dispatch(setDraggedOver({ id, where }));
        }
      }}
      onDragLeave={() => dispatch(setDraggedOver(undefined))}
      onMouseOver={(e) => {
        e.stopPropagation();
        dispatch(setHovered({ id, where }));
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        dispatch(setHovered(undefined));
      }}
      onClick={handleAddLocationClick}
      onDrop={(e) => {
        dispatch(setDraggedOver(undefined));
        handleSideDrop(e);
      }}
      className={
        commonClasses +
        "w-full h-1 " +
        (second ? "bottom-0 " : "") +
        extraClasses
      }
    >
      <AddSign />
    </div>
  );
});

const AddSign = () => {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg p-px px-1 rounded bg-inherit text-white"
      style={{
        fontFamily: "Roboto Mono, Roboto Mono Fallback",
      }}
    >
      +
    </div>
  );
};
