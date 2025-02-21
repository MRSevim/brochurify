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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { AddLocation, Layout, Where } from "@/utils/Types";
import { DragEvent } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";

const Editor = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [layoutToggle] = LayoutToggleContext.Use();
  const [settingsToggle] = SettingsToggleContext.Use();
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((state) => state.editor.active?.id);
  const addLocation = useAppSelector((state) => state.editor.addLocation);
  const draggedItem = useAppSelector((state) => state.editor.draggedItem);
  const pageWise = useAppSelector((state) => state.editor.pageWise);
  const [viewMode] = useViewMode();

  const maxWidth =
    viewMode === "desktop"
      ? undefined
      : viewMode === "tablet"
      ? "max-w-[768]"
      : "max-w-[360]";

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
      <div style={pageWise} className={"editor mx-auto " + maxWidth}>
        {data?.map((item) => {
          return (
            <div
              className="inline-block"
              key={item.id}
              style={{
                width: item.props.style.width,
                height: item.props.style.height,
              }}
            >
              {renderComponent(
                item,
                activeId,
                dispatch,
                false,
                addLocation,
                draggedItem,
                true
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Editor;

const renderComponent = (
  item: Layout,
  activeId: string | undefined,
  dispatch: ReturnType<typeof useAppDispatch>,
  parentIsRow: boolean,
  addLocation: AddLocation,
  draggedItem: string | undefined,
  inMainLayout: boolean
): React.ReactNode => {
  const Component = componentList[item.type as keyof typeof componentList];

  const id = item.id;
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };

  return (
    <div
      key={id}
      className="relative inline-block"
      style={{
        width: inMainLayout ? "100%" : item.props.style.width,
        height: inMainLayout ? "100%" : item.props.style.height,
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
      ></div>

      <FocusWrapper item={item}>
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
          <Component
            key={`${id}-${item.props.style.animation}`}
            id={id}
            {...item.props}
          >
            {item.props.child?.map((childItem) =>
              renderComponent(
                childItem,
                activeId,
                dispatch,
                item.type === "row",
                addLocation,
                draggedItem,
                false
              )
            )}
          </Component>
        </div>
      </FocusWrapper>

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
      ></div>
    </div>
  );
};
