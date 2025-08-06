import {
  selectActive,
  selectHoveredId,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { componentList } from "@/utils/ComponentsList";
import { findElementById } from "@/utils/EditorHelpers";
import { useIntersectionObserver } from "@/utils/hooks/useIntersectionObserver";
import { Layout, Style } from "@/utils/Types";
import { memo, useRef, useState } from "react";
import { SideDropOverlay } from "./SideDropOverlay";
import FocusWrapper from "@/components/FocusWrapper";
import { handleDrop } from "@/redux/slices/editorSlice";

const RenderedComponent = memo(
  ({ item }: { item: Layout }) => {
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
    console.log("component rendered", item.type);
    const ref = useRef<HTMLElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useIntersectionObserver([replayTrigger, styleString, wrapperRef], ref);
    useIntersectionObserver(
      [replayTrigger, styleString, wrapperRef],
      wrapperRef
    );
    return (
      <SideDropOverlay
        id={item.id}
        type={item.type}
        style={item.props.style}
        ref={wrapperRef}
        key={styleString + replayTrigger || ""}
      >
        <FocusWrapper id={item.id}>
          <CenterDropOverlay id={item.id}>
            <Component
              id={item.id}
              key={styleString + replayTrigger || ""}
              ref={ref}
              {...item.props}
            >
              <EditorChildren items={item.props.child} />
            </Component>
          </CenterDropOverlay>
        </FocusWrapper>
      </SideDropOverlay>
    );
  },
  function areEqual(
    prev: Readonly<{ item: Layout }>,
    next: Readonly<{ item: Layout }>
  ): boolean {
    const prevItem = prev.item;
    const nextItem = next.item;

    // If id or type changed, re-render
    if (prevItem.id !== nextItem.id || prevItem.type !== nextItem.type) {
      return false;
    }

    const prevProps = prevItem.props;
    const nextProps = nextItem.props;

    // Ignored keys are not needed for rendering anything on the editor
    const ignoredKeys = new Set(["href", "newTab", "anchorId"]);

    const prevKeys = Object.keys(prevProps).filter((k) => !ignoredKeys.has(k));
    const nextKeys = Object.keys(nextProps).filter((k) => !ignoredKeys.has(k));

    // If number of keys differ after filtering, re-render
    if (prevKeys.length !== nextKeys.length) {
      return false;
    }

    // Compare each non-ignored key using strict equality
    for (const key of prevKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }

    return true;
  }
);

const EditorChildren = memo(({ items }: { items: Layout[] | undefined }) => {
  return (
    <>
      {items?.map((childItem) => (
        <RenderedComponent key={childItem.id} item={childItem} />
      ))}
    </>
  );
});

const CenterDropOverlay = ({
  children,
  id,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const hovered = useAppSelector(selectHoveredId) === id;
  const [draggingOver, setDraggingOver] = useState(false);
  const active = useAppSelector(selectActive) === id || draggingOver;

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
          dispatch(handleDrop({ targetId: id, addLocation: null }));
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
export default RenderedComponent;
