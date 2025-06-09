import { componentList } from "@/utils/ComponentsList";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import {
  selectActive,
  selectHoveredId,
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { Layout, Style } from "@/utils/Types";
import React, { useEffect, useRef, useState } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import { styledElements } from "@/utils/StyledComponents";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";
import { findElementById } from "@/utils/EditorHelpers";
import useKeyPresses from "@/utils/hooks/useKeypresses";
import { useZoom } from "@/contexts/ZoomContext";
import { SideDropOverlay } from "./SideDropOverlay";
import { useEditorRef } from "@/contexts/EditorRefContext";
import { handleDrop } from "@/redux/slices/editorSlice";

const Editor = () => {
  const [layoutToggle] = LayoutToggleContext.Use();
  const [settingsToggle] = SettingsToggleContext.Use();
  const [zoom] = useZoom();
  const scale = 1 - zoom / 100;
  const [viewMode] = useViewMode();
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const pageWise = useAppSelector(selectPageWise);
  const ref = useEditorRef();
  const data = useAppSelector(selectLayout);

  let addedString;
  if (layoutToggle && settingsToggle) {
    addedString =
      "left-full right-full sm:left-96 sm:right-96 w-screen-both-excluded";
  } else if (layoutToggle) {
    addedString = "left-full sm:left-96 w-screen-one-excluded ";
  } else if (settingsToggle) {
    addedString = "right-full sm:left-0 sm:right-96 w-screen-one-excluded";
  }
  const maxWidth =
    viewMode === "desktop"
      ? "max-w-full"
      : viewMode === "tablet"
        ? "max-w-[768]"
        : "max-w-[360]";

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(ref.current.scrollHeight);
    }
  }, [zoom]);

  return (
    <div className={"relative h-full overflow-hidden " + addedString}>
      <div
        className={"overflow-auto mx-auto " + maxWidth}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "all 0.3s ease",
          height: `${100 / scale}%`,
          backgroundColor: pageWise["background-color"],
          maxHeight,
        }}
        ref={ref}
      >
        <EditorInner>
          {data.map((item) => {
            return <RenderedComponent key={item.id} item={item} />;
          })}
        </EditorInner>
      </div>
    </div>
  );
};

const EditorInner = ({ children }: { children: React.ReactNode }) => {
  const pageWise = useAppSelector(selectPageWise);
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);
  const variables = useAppSelector(selectVariables);
  useIntersectionObserver([globalTrigger], undefined);
  useKeyPresses();
  return (
    <styledElements.styledEditor
      styles={pageWise}
      variables={variables}
      className="editor relative"
      key={globalTrigger}
    >
      {" "}
      {children}
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
  const styleString = JSON.stringify(
    useAppSelector((state) => {
      const layout = state.editor.layout;

      const element = findElementById(layout, id);

      const style = element?.props.style as Style;

      return style;
    })
  );

  const ref = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver([replayTrigger, styleString, wrapperRef], ref);
  useIntersectionObserver([replayTrigger, styleString, wrapperRef], wrapperRef);

  return (
    <SideDropOverlay
      item={item}
      ref={wrapperRef}
      key={styleString + (replayTrigger || "")}
    >
      <FocusWrapper item={item}>
        <CenterDropOverlay item={item}>
          <Component
            key={styleString + (replayTrigger || "")}
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
const CenterDropOverlay = ({
  children,
  item,
}: {
  item: Layout;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const hovered = useAppSelector(selectHoveredId) === item.id;
  const [draggingOver, setDraggingOver] = useState(false);
  const active = useAppSelector(selectActive)?.id === item.id || draggingOver;
  return (
    <>
      <div
        className={
          "w-full h-full flex justify-center items-center " +
          (hovered ? " hovered" : "") +
          (active ? " active" : "")
        }
        onDrop={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDraggingOver(false);
          dispatch(handleDrop({ targetId: item.id, addLocation: null }));
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDraggingOver(true);
        }}
        onDragLeave={() => setDraggingOver(false)}
      >
        {children}
      </div>
    </>
  );
};
