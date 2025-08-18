import { useAddSectionToggleSetter } from "@/contexts/AddSectionToggleContext";
import {
  selectActive,
  selectAddLocation,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { handleDrop, setAddLocation } from "@/redux/slices/editorSlice";
import { Style, Where } from "@/utils/Types";
import { DragEvent, memo, useRef, useState } from "react";
import { styledElements } from "@/utils/StyledComponents";
import { useEditorRef } from "@/contexts/EditorRefContext";
import EditorActions from "./EditorActions";

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
  const addLocation = useAppSelector(selectAddLocation);
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";
  const notFixed = type !== "fixed";
  const isColumn = type === "column";
  const active = useAppSelector(selectActive) === id;
  return (
    <styledElements.styledComponentWrapperDiv
      className={"block " + (notFixed && "relative")}
      $styles={style}
      $type={type}
      ref={ref}
    >
      {notFixed && (
        <SideDropZone
          id={id}
          where="before"
          selected={beforeSelected}
          isColumn={isColumn}
        />
      )}
      {active && <EditorActions id={id} type={type} />}
      {children}
      {notFixed && (
        <SideDropZone
          second={true}
          id={id}
          where="after"
          selected={afterSelected}
          isColumn={isColumn}
        />
      )}
    </styledElements.styledComponentWrapperDiv>
  );
};

const SideDropZone = memo(
  ({
    where,
    id,
    selected,
    isColumn,
    second = false,
  }: {
    selected: boolean;
    isColumn: boolean;
    id: string;
    where: Where;
    second?: boolean;
  }) => {
    const [draggingOver, setDraggingOver] = useState(false);
    const commonClasses =
      "cursor-pointer absolute flex justify-center align-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-[60] ";
    const selectedClasses = "opacity-100 bg-activeBlue";
    const dispatch = useAppDispatch();
    const setToggle = useAddSectionToggleSetter();
    const addLocation = useAppSelector(selectAddLocation);

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
          setDraggingOver(true);
        }}
        onDragLeave={() => setDraggingOver(false)}
        onClick={handleAddLocationClick}
        onDrop={(e) => {
          setDraggingOver(false);
          handleSideDrop(e);
        }}
        className={
          commonClasses +
          (isColumn ? "h-full w-1 top-0 " : "w-full h-1 ") +
          (second && isColumn ? "right-0 " : "") +
          (second && !isColumn ? "bottom-0 " : "") +
          (draggingOver || selected ? selectedClasses : "bg-hoveredBlue")
        }
      >
        <AddSign />
      </div>
    );
  }
);

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

  usePositionListener(updateSignPosition, true); */

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
