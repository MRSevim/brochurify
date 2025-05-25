import { useAddSectionToggle } from "@/contexts/AddSectionToggleContext";
import {
  selectActive,
  selectAddLocation,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { handleDrop, setAddLocation } from "@/redux/slices/editorSlice";
import { Layout, Where } from "@/utils/Types";
import { DragEvent, useRef, useState } from "react";
import { styledElements } from "@/utils/StyledComponents";
import usePositionListener from "@/utils/hooks/usePositionListener";
import { useEditorRef } from "@/contexts/EditorRefContext";
import EditorActions from "./EditorActions";

export const SideDropOverlay = ({
  item,
  children,
  ref,
}: {
  item: Layout;
  ref: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) => {
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";
  const dispatch = useAppDispatch();
  const [, setToggle] = useAddSectionToggle();
  const notFixed = item.type !== "fixed";
  const isColumn = item.type === "column";
  const active = useAppSelector(selectActive)?.id === item.id;

  const handleAddLocationClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    where: Where
  ) => {
    e.stopPropagation();
    if (addLocation && addLocation.id === id && addLocation.where === where) {
      dispatch(setAddLocation(null));
    } else {
      dispatch(setAddLocation({ id, where }));
      setToggle(true);
    }
  };

  const handleSideDrop = (e: DragEvent<HTMLElement>, where: Where) => {
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
    <styledElements.styledComponentWrapperDiv
      className={"block " + (notFixed && "relative")}
      styles={item.props.style}
      ref={ref}
    >
      {notFixed && (
        <SideDropZone
          onClick={(e) => handleAddLocationClick(e, "before")}
          onDrop={(e) => handleSideDrop(e, "before")}
          selected={beforeSelected}
          isColumn={isColumn}
        >
          <AddSign />
        </SideDropZone>
      )}
      {active && <EditorActions item={item} />}
      {children}
      {notFixed && (
        <SideDropZone
          onClick={(e) => handleAddLocationClick(e, "after")}
          onDrop={(e) => handleSideDrop(e, "after")}
          selected={afterSelected}
          isColumn={isColumn}
        >
          <AddSign />
        </SideDropZone>
      )}
    </styledElements.styledComponentWrapperDiv>
  );
};

const SideDropZone = ({
  onDrop,
  onClick,
  selected,
  children,
  isColumn,
}: {
  onDrop: (e: DragEvent<HTMLElement>) => void;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
  isColumn: boolean;
}) => {
  const [draggingOver, setDraggingOver] = useState(false);
  const commonClasses =
    "cursor-pointer absolute flex justify-center align-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-[60] ";
  const selectedClasses = "opacity-100 bg-activeBlue";
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDraggingOver(true);
      }}
      onDragLeave={() => setDraggingOver(false)}
      onClick={onClick}
      onDrop={(e) => {
        setDraggingOver(false);
        onDrop(e);
      }}
      className={
        commonClasses +
        (isColumn ? "h-full w-1 " : "w-full h-1 ") +
        (draggingOver || selected ? selectedClasses : "bg-hoveredBlue")
      }
    >
      {children}
    </div>
  );
};

const AddSign = () => {
  const [marginTop, setMarginTop] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useEditorRef();

  const updateSignPosition = () => {
    requestAnimationFrame(() => {
      if (ref.current && editorRef.current) {
        const signRect = ref.current.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();

        let newMargin = 0;
        if (signRect.top <= editorRect.top) {
          newMargin = 12;
        } else if (signRect.bottom >= editorRect.bottom) {
          newMargin = -12;
        }

        setMarginTop(newMargin);
      }
    });
  };

  usePositionListener(updateSignPosition, true);

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-inherit"
      style={{ marginTop }}
      ref={ref}
    >
      +
    </div>
  );
};
