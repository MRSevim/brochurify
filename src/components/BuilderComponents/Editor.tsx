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
  selectAddLocation,
  selectLayout,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { Layout, Style, Where } from "@/utils/Types";
import React, { DragEvent } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/Helpers";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";
import { findElementById } from "@/utils/EditorHelpers";

const Editor = () => {
  const [layoutToggle] = LayoutToggleContext.Use();
  const [settingsToggle] = SettingsToggleContext.Use();

  let addedString;
  if (layoutToggle && settingsToggle) {
    addedString = "left-full sm:left-96 sm:right-96 w-screen-both-excluded";
  } else if (layoutToggle) {
    addedString = "left-full sm:left-96 w-screen-one-excluded";
  } else if (settingsToggle) {
    addedString = "right-full sm:left-0 sm:right-96 w-screen-one-excluded";
  }

  return (
    <section className={"relative h-screen-header-excluded " + addedString}>
      <EditorInner />
    </section>
  );
};

const EditorInner = () => {
  const data = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const [viewMode] = useViewMode();
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);
  useIntersectionObserver([globalTrigger]);

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
    >
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

  useIntersectionObserver([replayTrigger]);
  return (
    <SideDropOverlay item={item}>
      <FocusWrapper item={item}>
        <CenterDropOverlay item={item}>
          <Component
            key={(animationsString || "") + (replayTrigger || "")}
            id={id}
            {...item.props}
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
  const notFixed = item.type !== "fixed";

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };
  return (
    <styledElements.styledComponentWrapperDiv
      className={"inline-block align-top " + (notFixed && " relative")}
      styles={item.props.style}
    >
      {notFixed && (
        <div
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "before")}
          onDragLeave={() => handleDragLeaveCaller(dispatch)}
          className={
            "absolute z-50 h-full w-1 " +
            (beforeSelected ? " bg-lime-700	" : " ")
          }
        />
      )}
      {children}
      {notFixed && (
        <div
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "after")}
          onDragLeave={() => handleDragLeaveCaller(dispatch)}
          className={
            "absolute z-50 h-full w-1 right-0 top-0 " +
            (afterSelected ? " bg-lime-700	" : " ")
          }
        />
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
  return (
    <>
      <div
        className="w-full h-full flex items-center"
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
