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
import { Layout, Where } from "@/utils/Types";
import React, { DragEvent } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/Helpers";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";

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
  useIntersectionObserver([data, globalTrigger]);

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
        return (
          <RenderedComponent key={item.id} item={item} parentIsRow={false} />
        );
      })}
    </styledElements.styledEditor>
  );
};

export default Editor;

const RenderedComponent = ({
  item,
  parentIsRow,
}: {
  item: Layout;
  parentIsRow: boolean;
}) => {
  const Component = componentList[item.type as keyof typeof componentList];
  const id = item.id;
  const replayTrigger = useAppSelector((state) => {
    return state.replay.replayArr.find((item) => item.id === id)?.trigger;
  });

  useIntersectionObserver([replayTrigger]);
  return (
    <SideDropOverlay item={item} parentIsRow={parentIsRow}>
      <FocusWrapper item={item}>
        <CenterDropOverlay item={item}>
          <Component key={replayTrigger} id={id} {...item.props}>
            {item.props.child?.map((childItem) => (
              <RenderedComponent
                key={childItem.id}
                item={childItem}
                parentIsRow={item.type === "row"}
              />
            ))}
          </Component>
        </CenterDropOverlay>
      </FocusWrapper>
    </SideDropOverlay>
  );
};
const SideDropOverlay = ({
  item,
  parentIsRow,
  children,
}: {
  item: Layout;
  parentIsRow: boolean;
  children: React.ReactNode;
}) => {
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";
  const dispatch = useAppDispatch();

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };
  return (
    <div
      className="inline-block relative"
      style={{
        width: item.props.style.width,
        height: item.props.style.height,
      }}
    >
      <div
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "before")}
        onDragLeave={() => handleDragLeaveCaller(dispatch)}
        className={
          "absolute z-50 " +
          (parentIsRow ? "h-full w-1	" : " w-full h-1 top-0") +
          (beforeSelected ? " bg-lime-700	" : " ")
        }
      />
      {children}
      <div
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "after")}
        onDragLeave={() => handleDragLeaveCaller(dispatch)}
        className={
          "absolute z-50 " +
          (parentIsRow
            ? "h-full w-1 right-0 top-0 "
            : " w-full h-1 bottom-0 ") +
          (afterSelected ? " bg-lime-700	" : " ")
        }
      />
    </div>
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
