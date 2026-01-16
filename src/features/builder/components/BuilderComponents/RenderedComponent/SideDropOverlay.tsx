import { useAddSectionToggleSetter } from "@/features/builder/utils/contexts/AddSectionToggleContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  handleDrop,
  setAddLocation,
  setDraggedOver,
  setHovered,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { Style, Where } from "@/utils/Types";
import { DragEvent, memo, useRef, useState } from "react";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { useEditorRef } from "@/features/builder/utils/contexts/EditorRefContext";
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
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
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
      })
    );
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!draggingOver) {
          dispatch(setDraggedOver({ id: id, where }));
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
  const [marginTop, setMarginTop] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  /* const editorRef = useEditorRef(); */

  //This code causes headache by causing jumps on ui
  /*   const updateSignPosition = () => {
    requestAnimationFrame(() => {
      if (ref.current && editorRef.current) {
        const signRect = ref.current.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();

        let newMarginTop = 0;
        if (signRect.top <= editorRect.top) {
          newMarginTop = 12;
        } else if (signRect.bottom >= editorRect.bottom) {
          newMarginTop = -12;
        }

        setMarginTop(newMarginTop);
        let newMarginLeft = 0;
        if (signRect.left <= editorRect.left) {
          newMarginLeft = 12;
        } else if (signRect.right >= editorRect.right) {
          newMarginLeft = -12;
        }
        setMarginLeft(newMarginLeft);
      }
    });
  };

    useEffect(() => {
      updateSignPosition();
    }, []); */

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg p-px px-1 rounded bg-inherit text-white"
      style={{
        marginTop,
        marginLeft,
        fontFamily: "Roboto Mono, Roboto Mono Fallback",
      }}
      ref={ref}
    >
      +
    </div>
  );
};
