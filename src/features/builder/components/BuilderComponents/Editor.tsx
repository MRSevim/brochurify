import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/features/builder/utils/contexts/ToggleContext";
import {
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppSelector,
} from "@/lib/redux/hooks";
import React, { useEffect, useState } from "react";
import { useViewModeState } from "@/features/builder/utils/contexts/ViewModeContext";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { useIntersectionObserver } from "@/features/builder/utils/hooks/useIntersectionObserver";
import useKeyPresses from "@/features/builder/utils/hooks/useKeypresses";
import { useZoom } from "@/features/builder/utils/contexts/ZoomContext";
import { useEditorRef } from "@/features/builder/utils/contexts/EditorRefContext";
import RenderedComponent from "./RenderedComponent/RenderedComponent";

const Editor = () => {
  return (
    <EditorWrapper>
      <EditorInner>
        <EditorComponents />
      </EditorInner>
    </EditorWrapper>
  );
};

const EditorWrapper = ({ children }: { children: React.ReactNode }) => {
  const layoutToggle = LayoutToggleContext.useToggle();
  const settingsToggle = SettingsToggleContext.useToggle();
  const [zoom] = useZoom();
  const scale = 1 - zoom / 100;
  const viewMode = useViewModeState();
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const pageWise = useAppSelector(selectPageWise);
  const ref = useEditorRef();

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
        ? "max-w-[768px]"
        : "max-w-[360px]";

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(ref.current.scrollHeight);
    }
  }, [zoom]);

  return (
    <div className={"relative h-full overflow-hidden " + addedString}>
      <div
        className={`overflow-auto mx-auto ${maxWidth}`}
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
        {children}
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
      $styles={pageWise}
      $variables={variables}
      className="editor relative"
      key={globalTrigger}
    >
      {" "}
      {children}
    </styledElements.styledEditor>
  );
};

const EditorComponents = () => {
  const data = useAppSelector(selectLayout);
  return (
    <>
      {data.map((item) => {
        return <RenderedComponent key={item.id} item={item} />;
      })}
    </>
  );
};

export default Editor;
