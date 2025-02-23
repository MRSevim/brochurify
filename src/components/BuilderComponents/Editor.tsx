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
import { AddLocation, Layout, Style, Where } from "@/utils/Types";
import { DragEvent } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/Helpers";

const Editor = () => {
  const data = useAppSelector(selectLayout);
  const [layoutToggle] = LayoutToggleContext.Use();
  const [settingsToggle] = SettingsToggleContext.Use();
  const addLocation = useAppSelector(selectAddLocation);
  const draggedItem = useAppSelector((state) => state.editor.draggedItem);
  const pageWise = useAppSelector(selectPageWise);
  const [viewMode] = useViewMode();
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);
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
      <styledElements.styledDiv
        styles={pageWise}
        className={"editor mx-auto " + maxWidth}
        key={globalTrigger}
      >
        {data.map((item) => {
          return (
            <RenderedComponent
              key={item.id}
              item={item}
              parentIsRow={false}
              addLocation={addLocation}
              draggedItem={draggedItem}
            />
          );
        })}
      </styledElements.styledDiv>
    </section>
  );
};

export default Editor;

const RenderedComponent = ({
  item,
  parentIsRow,
  addLocation,
  draggedItem,
}: {
  item: Layout;
  parentIsRow: boolean;
  addLocation: AddLocation;
  draggedItem: string | undefined;
}) => {
  const Component = componentList[item.type as keyof typeof componentList];
  const dispatch = useAppDispatch();
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

  const replayTrigger = useAppSelector((state) => {
    return state.replay.replayArr.find((item) => item.id === id)?.trigger;
  });

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
          <Component key={replayTrigger} id={id} {...item.props}>
            {item.props.child?.map((childItem) => (
              <RenderedComponent
                key={childItem.id}
                item={childItem}
                parentIsRow={item.type === "row"}
                addLocation={addLocation}
                draggedItem={draggedItem}
              />
            ))}
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
