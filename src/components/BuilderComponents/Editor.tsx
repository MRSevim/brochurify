import {
  handleCenterDragOverCaller,
  handleCenterDropCaller,
  handleDragLeaveCaller,
  handleSideDragOverCaller,
  handleSideDropCaller,
} from "@/utils/DragAndDropHelpers";
import { componentList } from "@/utils/Helpers";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import {
  selectActive,
  selectAddLocation,
  selectHoveredId,
  selectLayout,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { Layout, Style, Where } from "@/utils/Types";
import React, { DragEvent, useRef } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/Helpers";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";
import { findElementById } from "@/utils/EditorHelpers";
import useKeyPresses from "@/utils/hooks/useKeypresses";
import { useZoom } from "@/contexts/ZoomContext";
import { useAddSectionToggle } from "@/contexts/AddSectionToggleContext";
import { setAddLocation } from "@/redux/slices/editorSlice";

const Editor = () => {
  const [layoutToggle] = LayoutToggleContext.Use();
  const [settingsToggle] = SettingsToggleContext.Use();

  let addedString;
  if (layoutToggle && settingsToggle) {
    addedString =
      "left-full right-full sm:left-96 sm:right-96 w-screen-both-excluded";
  } else if (layoutToggle) {
    addedString = "left-full sm:left-96 w-screen-one-excluded";
  } else if (settingsToggle) {
    addedString = "right-full sm:left-0 sm:right-96 w-screen-one-excluded";
  }

  return (
    <section className={"relative h-full overflow-hidden " + addedString}>
      <EditorInner />
    </section>
  );
};

const EditorInner = () => {
  const data = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);
  useIntersectionObserver([globalTrigger], undefined);
  useKeyPresses();
  const [zoom] = useZoom();
  const scale = 1 - zoom / 100;
  const [viewMode] = useViewMode();

  const maxWidth =
    viewMode === "desktop"
      ? undefined
      : viewMode === "tablet"
      ? "max-w-[768]"
      : "max-w-[360]";

  return (
    <styledElements.styledEditor
      styles={pageWise}
      className={"editor mx-auto " + maxWidth}
      key={globalTrigger}
      style={{
        height: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "all 0.3s ease",
      }}
    >
      {" "}
      {data.map((item) => {
        return <RenderedComponent key={item.id} item={item} />;
      })}
    </styledElements.styledEditor>
  );
};

export default Editor;

const RenderedComponent = ({ item }: { item: Layout }) => {
  const Component = componentList[item.type as keyof typeof componentList];
  const id = item.id;
  const replayTrigger = useAppSelector((state) => {
    return state.replay.replayArr.find((item) => item.id === id)?.trigger;
  });
  const animationsString = useAppSelector((state) => {
    const layout = state.editor.layout;

    const element = findElementById(layout, id);

    const style = element?.props.style as Style;

    return style?.["&.scrolled"]?.["animation"];
  }) as string;

  const ref = useRef<HTMLElement | null>(null);

  useIntersectionObserver([replayTrigger, animationsString], ref);

  return (
    <SideDropOverlay item={item}>
      <FocusWrapper item={item}>
        <CenterDropOverlay item={item}>
          <Component
            key={animationsString + (replayTrigger || "")}
            id={id}
            ref={ref}
            {...item.props}
            anchorId={item.props.anchorId && "user-" + item.props.anchorId}
          >
            {item.props.child?.map((childItem) => (
              <RenderedComponent key={childItem.id} item={childItem} />
            ))}
          </Component>
        </CenterDropOverlay>
      </FocusWrapper>
    </SideDropOverlay>
  );
};
const SideDropOverlay = ({
  item,
  children,
}: {
  item: Layout;
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
  const commonClasses =
    "cursor-pointer absolute flex justify-center align-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-50 ";
  const selectedClasses = "opacity-100 bg-activeBlue";

  const AddSign = () => (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-inherit">
      +
    </div>
  );

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

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };
  return (
    <styledElements.styledComponentWrapperDiv
      className={"block " + (notFixed && "relative")}
      styles={item.props.style}
    >
      {notFixed && (
        <div
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "before")}
          onDragLeave={() => handleDragLeaveCaller(dispatch)}
          onClick={(e) => handleAddLocationClick(e, "before")}
          className={
            commonClasses +
            (isColumn ? "h-full w-1 " : "w-full h-1 ") +
            (beforeSelected ? selectedClasses : "bg-hoveredBlue")
          }
        >
          <AddSign />
        </div>
      )}
      {children}
      {notFixed && (
        <div
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "after")}
          onDragLeave={() => handleDragLeaveCaller(dispatch)}
          onClick={(e) => handleAddLocationClick(e, "after")}
          className={
            commonClasses +
            "right-0 " +
            (isColumn ? "h-full w-1 top-0 " : "w-full h-1 top-full ") +
            (afterSelected ? selectedClasses : "bg-hoveredBlue")
          }
        >
          {" "}
          <AddSign />
        </div>
      )}
    </styledElements.styledComponentWrapperDiv>
  );
};
const CenterDropOverlay = ({
  children,
  item,
}: {
  item: Layout;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const hoveredId = useAppSelector(selectHoveredId);
  const activeId = useAppSelector(selectActive)?.id;
  return (
    <>
      <div
        className={
          "w-full h-full flex items-center" +
          (hoveredId === item.id ? " hovered" : "") +
          (activeId === item.id ? " active" : "")
        }
        onDrop={(e) => {
          e.stopPropagation();
          handleCenterDropCaller(e, dispatch, item.id);
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          handleCenterDragOverCaller(e, item, dispatch);
        }}
        onDragLeave={() => handleDragLeaveCaller(dispatch)}
      >
        {children}
      </div>
    </>
  );
};
