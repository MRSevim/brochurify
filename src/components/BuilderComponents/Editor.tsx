"use client";
import {
  componentList,
  handleCenterDragOverCaller,
  handleCenterDropCaller,
  handleDragLeaveCaller,
  handleSideDragOverCaller,
  handleSideDropCaller,
} from "@/utils/Helpers";
import { LayoutToggleContext } from "@/contexts/ToggleContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { AddLocation, Layout, Where } from "@/utils/Types";
import { DragEvent } from "react";

const Editor = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [layoutToggle] = LayoutToggleContext.Use();
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.editor.active);
  const addLocation = useAppSelector((state) => state.editor.addLocation);

  return (
    <section
      className={
        "relative p-3 " +
        (layoutToggle ? "left-full sm:left-96 w-screen-layout-excluded" : "")
      }
    >
      {data?.map((item) => {
        return (
          <section key={item.id}>
            {renderComponent(item, active, dispatch, false, addLocation)}
          </section>
        );
      })}
    </section>
  );
};

export default Editor;

const renderComponent = (
  item: Layout,
  active: string | undefined,
  dispatch: ReturnType<typeof useAppDispatch>,
  parentIsRow: boolean,
  addLocation: AddLocation
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
    <section key={id} className="relative">
      <section
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "before")}
        onDragLeave={() => handleDragLeaveCaller(dispatch)}
        className={
          "absolute " +
          (parentIsRow ? "h-full w-1	" : " ") +
          (beforeSelected ? " bg-lime-700	" : " ")
        }
      ></section>
      <section className="mx-1">
        <FocusWrapper itemId={id}>
          <section
            onDrop={(e) => {
              e.stopPropagation();
              handleCenterDropCaller(e, dispatch, item.id);
            }}
            onDragOver={(e) => {
              e.stopPropagation();
              handleCenterDragOverCaller(e, id, dispatch);
            }}
            onDragLeave={() => handleDragLeaveCaller(dispatch)}
            className={active === id ? " border border-dark border-dashed" : ""}
          >
            <Component {...item.props}>
              {item.props.child?.map((childItem) =>
                renderComponent(
                  childItem,
                  active,
                  dispatch,
                  item.type === "row",
                  addLocation
                )
              )}
            </Component>
          </section>
        </FocusWrapper>
      </section>
      <section
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "after")}
        onDragLeave={() => handleDragLeaveCaller(dispatch)}
        className={
          "absolute right-0 top-0 " +
          (parentIsRow ? "h-full w-1	" : " ") +
          (afterSelected ? " bg-lime-700	" : " ")
        }
      ></section>
    </section>
  );
};
