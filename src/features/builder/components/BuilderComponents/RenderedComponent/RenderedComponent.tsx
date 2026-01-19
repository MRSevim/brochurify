import { useAppSelector } from "@/lib/redux/hooks";
import { componentList } from "@/features/builder/utils/ComponentsList";
import { findElementById } from "@/features/builder/utils/EditorHelpers";
import { useIntersectionObserver } from "@/features/builder/utils/hooks/useIntersectionObserver";
import { CONFIG, Layout, Style } from "@/features/builder/utils/types.d";
import { memo, useRef } from "react";
import { SideDropOverlay } from "./SideDropOverlay";
import FocusWrapper from "@/features/builder/components/FocusWrapper";
import {
  selectActive,
  selectDraggedOver,
  selectHovered,
} from "@/features/builder/lib/redux/selectors";

const RenderedComponent = memo(
  ({ item }: { item: Layout }) => {
    const Component = componentList[item.type as keyof typeof componentList];
    const id = item.id;
    const replayTrigger = useAppSelector((state) => {
      return state.replay.replayArr.find((item) => item.id === id)?.trigger;
    });
    const styleString = useAppSelector((state) => {
      const layout = state.editor.layout;
      const element = findElementById(layout, id);
      if (element) {
        const style = element.props.style;

        // Utility function to safely extract styles from optional nested layers
        const extractStyles = (s?: Style): Record<string, unknown> => ({
          animation: s?.animation,
          transition: s?.transition,
          [CONFIG.possibleOuterTypes.scrolled]:
            s?.[CONFIG.possibleOuterTypes.scrolled],
        });

        const tablet = style?.[
          CONFIG.possibleOuterTypes.tabletContainerQuery
        ] as Style | undefined;
        const mobile = style?.[
          CONFIG.possibleOuterTypes.mobileContainerQuery
        ] as Style | undefined;

        return JSON.stringify({
          base: extractStyles(style),
          tablet: extractStyles(tablet),
          mobile: extractStyles(mobile),
        });
      }
      return "";
    });
    const ref = useRef<HTMLElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useIntersectionObserver([replayTrigger, item.props.style, wrapperRef], ref);
    useIntersectionObserver(
      [replayTrigger, item.props.style, wrapperRef],
      wrapperRef,
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
    next: Readonly<{ item: Layout }>,
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
  },
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
  const itemHovered = useAppSelector(selectHovered);
  const hovered = itemHovered?.id === id && !itemHovered.where;
  const itemDraggedOver = useAppSelector(selectDraggedOver);
  const draggedOver = itemDraggedOver?.id === id && !itemDraggedOver.where;
  const active = useAppSelector(selectActive) === id || draggedOver;
  return (
    <>
      <div
        className={
          "w-full h-full flex justify-center items-center " +
          (hovered ? " hovered" : "") +
          (active ? " active" : "")
        }
      >
        {children}
      </div>
    </>
  );
};
export default RenderedComponent;
