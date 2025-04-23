import {
  handleCenterDragOverCaller,
  handleCenterDropCaller,
  handleDragLeaveCaller,
} from "@/utils/DragAndDropHelpers";
import { componentList } from "@/utils/Helpers";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import {
  selectActive,
  selectHoveredId,
  selectLayout,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { Layout, Style } from "@/utils/Types";
import React, { useRef } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/Helpers";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";
import { findElementById } from "@/utils/EditorHelpers";
import useKeyPresses from "@/utils/hooks/useKeypresses";
import { useZoom } from "@/contexts/ZoomContext";
import { SideDropOverlay } from "./SideDropOverlay";
import EditorActions from "./EditorActions";

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
  const ref = useRef<HTMLDivElement | null>(null);

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
      ref={ref}
      style={{
        height: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "all 0.3s ease",
      }}
    >
      {" "}
      {data.map((item) => {
        return <RenderedComponent key={item.id} item={item} editorRef={ref} />;
      })}
    </styledElements.styledEditor>
  );
};

export default Editor;

const RenderedComponent = ({
  item,
  editorRef,
}: {
  item: Layout;
  editorRef: React.RefObject<HTMLDivElement | null>;
}) => {
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
    <SideDropOverlay item={item} editorRef={editorRef}>
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
              <RenderedComponent
                key={childItem.id}
                item={childItem}
                editorRef={editorRef}
              />
            ))}
          </Component>
        </CenterDropOverlay>
      </FocusWrapper>
    </SideDropOverlay>
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
  const hovered = useAppSelector(selectHoveredId) === item.id;
  const active = useAppSelector(selectActive)?.id === item.id;
  return (
    <>
      <div
        className={
          "w-full h-full flex items-center" +
          (hovered ? " hovered" : "") +
          (active ? " active" : "")
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
        {(active || hovered) && <EditorActions item={item} />}
        {children}
      </div>
    </>
  );
};
