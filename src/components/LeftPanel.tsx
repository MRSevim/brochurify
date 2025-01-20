"use client";
import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FocusWrapper from "./FocusWrapper";
import {
  componentList,
  handleCenterDragOverCaller,
  handleCenterDropCaller,
  handleDragLeaveCaller,
  handleSideDragOverCaller,
  handleSideDropCaller,
} from "@/utils/Helpers";
import {
  SetStateAction,
  Dispatch,
  useState,
  useRef,
  useEffect,
  DragEvent,
} from "react";
import {
  addElement,
  deleteElement,
  setAddLocation,
} from "@/redux/slices/editorSlice";
import Icon from "./Icon";
import { Layout, Where } from "@/utils/Types";

type VisibilityMap = Map<string, boolean>;

const LeftPanel = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [toggle] = LayoutToggleContext.Use();
  // Centralized visibility map state
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap>(new Map());
  const depth = 0;

  return (
    <PanelWrapper toggle={toggle} from="left">
      <AddSection />
      <ul className="overflow-y-auto max-h-scrollable-container	">
        {data?.map((item) => {
          return (
            <section key={item.id}>
              <LayoutItem
                item={item}
                depth={depth}
                visibilityMap={visibilityMap}
                setVisibilityMap={setVisibilityMap}
              />
            </section>
          );
        })}
      </ul>
    </PanelWrapper>
  );
};

const LayoutItem = ({
  item,
  depth,
  visibilityMap,
  setVisibilityMap,
}: {
  item: Layout;
  depth: number;
  visibilityMap: VisibilityMap;
  setVisibilityMap: Dispatch<SetStateAction<VisibilityMap>>;
}) => {
  const active = useAppSelector((state) => state.editor.active);
  const addLocation = useAppSelector((state) => state.editor.addLocation);
  const id = item.id;
  const dispatch = useAppDispatch();
  const isExpanded = visibilityMap.get(id) ?? false;
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";

  // Calculate the margin based on depth, capping it at ml-4
  const marginLeftClass = depth === 0 ? "ml-2" : depth === 1 ? "ml-5" : "ml-7";

  const toggleVisibility = () => {
    setVisibilityMap((prev) => {
      const newMap = new Map(prev);

      if (isExpanded) {
        // Remove item ID if it is currently expanded
        newMap.delete(id);
      } else {
        // Add item ID if it is currently collapsed
        newMap.set(id, true);
      }

      return newMap;
    });
  };

  const handleAddLocationClick = (where: Where) => {
    if (addLocation && addLocation.id === id && addLocation.where === where) {
      dispatch(setAddLocation(null));
    } else dispatch(setAddLocation({ id, where }));
  };

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };

  const handleDragLeave = () => {
    handleDragLeaveCaller(dispatch);
  };

  return (
    <>
      <section className="relative">
        <section
          onClick={() => handleAddLocationClick("before")}
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "before")}
          onDragLeave={handleDragLeave}
          className={
            "absolute -top-3 left-0 right-0 m-2 h-2 hover:bg-gray-800 " +
            marginLeftClass +
            (beforeSelected ? " bg-light hover:bg-light" : "")
          }
        ></section>
        <section className={"m-2 " + marginLeftClass}>
          <FocusWrapper itemId={id}>
            <li
              onDrop={(e) => {
                handleCenterDropCaller(e, dispatch, id);
              }}
              onDragOver={(e) => {
                handleCenterDragOverCaller(e, id, dispatch);
              }}
              onDragLeave={handleDragLeave}
              className={
                "p-2 border flex items-center justify-between	" +
                (active === id ? "border-light" : "border-slate-500")
              }
            >
              <section>
                {item.props.child && item.props.child.length > 0 && (
                  <ToggleButton
                    toggled={isExpanded}
                    onClick={toggleVisibility}
                  />
                )}
                {item.type}
              </section>
              <DeleteButton itemId={id} />
            </li>
          </FocusWrapper>
        </section>
        <section
          onClick={() => {
            handleAddLocationClick("after");
          }}
          onDrop={handleSideDrop}
          onDragOver={(e) => handleSideDragOver(e, "after")}
          onDragLeave={handleDragLeave}
          className={
            "absolute -bottom-3 left-0 right-0 m-2 h-2 hover:bg-gray-800 " +
            marginLeftClass +
            (afterSelected ? " bg-light hover:bg-light" : "")
          }
        ></section>
      </section>
      {isExpanded && (
        <ul>
          {/* Render child elements recursively */}
          {item.props.child?.map((childItem) => (
            <LayoutItem
              key={childItem.id}
              item={childItem}
              depth={Math.min(depth + 1, 2)} // Cap depth at 2
              visibilityMap={visibilityMap}
              setVisibilityMap={setVisibilityMap}
            />
          ))}
        </ul>
      )}
    </>
  );
};

const AddSection = () => {
  const availableElements = Object.keys(componentList);
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLElement | null>(null);
  const addLocation = useAppSelector((state) => state.editor.addLocation);

  const handleGeneralClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleGeneralClick);

    return () => {
      document.removeEventListener("click", handleGeneralClick);
    };
  });

  return (
    <section className="flex justify-center relative z-10">
      <button
        className="border rounded border-cyan-100	p-3"
        onClick={() => setToggle((prev) => !prev)}
      >
        Add +
      </button>
      {toggle && (
        <section
          ref={ref}
          className="absolute top-full border rounded border-cyan-100 mt-2 p-3 bg-dark flex flex-wrap"
        >
          {availableElements.map((item, i) => (
            <button
              key={i}
              className="rounded hover:bg-gray-800 p-3 w-1/3 flex justify-center"
              onClick={() => {
                dispatch(addElement({ type: item, addLocation }));
                setToggle(false);
              }}
            >
              {item}
            </button>
          ))}
        </section>
      )}
    </section>
  );
};

const ToggleButton = ({
  onClick,
  toggled,
}: {
  onClick: () => void;
  toggled: boolean;
}) => {
  const type = toggled ? "chevron-up" : "chevron-down";
  return (
    <button
      className="p-1 mr-2"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon type={type} size="20px" />
    </button>
  );
};

const DeleteButton = ({ itemId }: { itemId: string }) => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="bg-red-800 p-1 rounded"
      onClick={(event) => {
        event.stopPropagation();
        dispatch(deleteElement(itemId));
      }}
    >
      <Icon type="trash-fill" size="20px" />
    </button>
  );
};
export default LeftPanel;
