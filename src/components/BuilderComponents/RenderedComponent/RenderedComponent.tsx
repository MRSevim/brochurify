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

const RenderedComponent = memo(({ item }: { item: Layout }) => {
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
      key={styleString + replayTrigger || ""}
    >
      <FocusWrapper item={item}>
        <CenterDropOverlay item={item}>
          <Component
            id={item.id}
            key={styleString + replayTrigger || ""}
            ref={ref}
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
});

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

export default RenderedComponent;
