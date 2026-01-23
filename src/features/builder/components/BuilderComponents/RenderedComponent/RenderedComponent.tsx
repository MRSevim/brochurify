import { useAppSelector } from "@/lib/redux/hooks";
import { componentList } from "@/features/builder/utils/ComponentsList";
import { findElementById } from "@/features/builder/utils/EditorHelpers";
import { useIntersectionObserver } from "@/features/builder/utils/hooks/useIntersectionObserver";
import { CONFIG, Style } from "@/features/builder/utils/types/types.d";
import { cloneElement, JSX, memo, useRef } from "react";
import { SideDropOverlay } from "./SideDropOverlay";
import FocusWrapper from "@/features/builder/components/FocusWrapper";
import {
  selectActive,
  selectDraggedOver,
  selectHovered,
} from "@/features/builder/lib/redux/selectors";
import { Layout } from "@/features/builder/utils/types/propTypes.d";

const RenderedComponent = memo(
  ({ item }: { item: Layout }) => {
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
    let Component: JSX.Element;

    switch (item.type) {
      case "button":
        Component = componentList.button({
          ...item.props,
          id,
          ref,
          children: <EditorChildren items={item.props.child} />,
        });
        break;
      case "column":
        Component = componentList.column({
          ...item.props,
          id,
          ref,
          children: <EditorChildren items={item.props.child} />,
        });
        break;
      case "text":
        Component = componentList.text({
          ...item.props,
          id,
          ref,
        });
        break;
      case "row":
        Component = componentList.row({
          ...item.props,
          id,
          ref,
          children: <EditorChildren items={item.props.child} />,
        });
        break;
      case "image":
        Component = componentList.image({
          ...item.props,
          id,
          ref,
        });
        break;
      case "audio":
        Component = componentList.audio({
          ...item.props,
          id,
          ref,
        });
        break;
      case "video":
        Component = componentList.video({
          ...item.props,
          id,
          ref,
        });
        break;
      case "container":
        Component = componentList.container({
          ...item.props,
          id,
          ref,
          children: <EditorChildren items={item.props.child} />,
        });
        break;
      case "divider":
        Component = componentList.divider({
          ...item.props,
          id,
          ref,
        });
        break;
      case "icon":
        Component = componentList.icon({
          ...item.props,
          id,
          ref,
        });
        break;
      case "fixed":
        Component = componentList.fixed({
          ...item.props,
          id,
          ref,
          children: <EditorChildren items={item.props.child} />,
        });
        break;
      default:
        throw Error("Pass a valid type to RenderedComponent");
    }

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
            {cloneElement(Component, {
              key: styleString + replayTrigger || "",
            })}
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

    const prevKeys = Object.keys(prevProps).filter(
      (k) => !ignoredKeys.has(k),
    ) as (keyof typeof prevProps)[];

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

const EditorChildren = memo(({ items }: { items: Layout[] }) => {
  return (
    <>
      {items.map((childItem) => (
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
