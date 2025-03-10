import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import {
  selectActive,
  selectAddLocation,
  selectLayout,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "./FocusWrapper";
import {
  handleCenterDragOverCaller,
  handleCenterDropCaller,
  handleDragLeaveCaller,
  handleSideDragOverCaller,
  handleSideDropCaller,
} from "@/utils/DragAndDropHelpers";
import { componentList } from "@/utils/Helpers";
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
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";

type VisibilityMap = Map<string, boolean>;

const LeftPanel = () => {
  const [toggle] = LayoutToggleContext.Use();

  return (
    <PanelWrapper toggle={toggle} from="left">
      <LayoutInner />
    </PanelWrapper>
  );
};

const LayoutInner = () => {
  const data = useAppSelector(selectLayout);
  // Centralized visibility map state
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap>(new Map());
  const depth = 0;

  return (
    <>
      <AddSection />
      <div className="overflow-y-auto max-h-scrollable-container gutter-stable">
        {data?.map((item) => {
          return (
            <LayoutItem
              key={item.id}
              item={item}
              depth={depth}
              visibilityMap={visibilityMap}
              setVisibilityMap={setVisibilityMap}
            />
          );
        })}
      </div>
    </>
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
  const id = item.id;
  const dispatch = useAppDispatch();
  const isExpanded = visibilityMap.get(id) ?? false;

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

  const handleDragLeave = () => {
    handleDragLeaveCaller(dispatch);
  };

  return (
    <>
      <SideDropWrapper
        depth={depth}
        handleDragLeave={handleDragLeave}
        item={item}
      >
        <FocusWrapper item={item}>
          <CenterDropWrapper
            item={item}
            visibilityMap={visibilityMap}
            setVisibilityMap={setVisibilityMap}
            handleDragLeave={handleDragLeave}
          >
            {item.props.child && item.props.child.length > 0 && (
              <ToggleButton toggled={isExpanded} onClick={toggleVisibility} />
            )}
            {item.type}

            <DeleteButton
              onClick={(event) => {
                event.stopPropagation();
                dispatch(deleteElement(id));
              }}
            />
          </CenterDropWrapper>
        </FocusWrapper>
      </SideDropWrapper>
      {isExpanded && (
        <>
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
        </>
      )}
    </>
  );
};

const CenterDropWrapper = ({
  item,
  visibilityMap,
  setVisibilityMap,
  children,
  handleDragLeave,
}: {
  item: Layout;

  handleDragLeave: () => void;
  children: React.ReactNode;
  visibilityMap: VisibilityMap;
  setVisibilityMap: Dispatch<SetStateAction<VisibilityMap>>;
}) => {
  const activeId = useAppSelector(selectActive)?.id;
  const id = item.id;
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);

  useEffect(() => {
    const reveal = (activeId: string | undefined, layout: Layout[]) => {
      if (!activeId) return;

      const getParentIds = (
        id: string,
        layout: Layout[],
        parents: string[] = []
      ): string[] => {
        for (const item of layout) {
          if (item.id === id) return parents;

          if (item.props.child) {
            const found = getParentIds(id, item.props.child, [
              ...parents,
              item.id,
            ]);
            if (found.length) return found;
          }
        }
        return [];
      };

      const parentIds = getParentIds(activeId, layout);

      setVisibilityMap((prevMap) => {
        const newMap = new Map(prevMap);
        parentIds.forEach((parentId) => newMap.set(parentId, true));
        return newMap;
      });
    };

    reveal(activeId, layout);
  }, [activeId]);
  return (
    <div
      onDrop={(e) => {
        handleCenterDropCaller(e, dispatch, id);
      }}
      onDragOver={(e) => {
        handleCenterDragOverCaller(e, item, dispatch);
      }}
      onDragLeave={handleDragLeave}
      className={
        "p-2 border flex items-center justify-between	" +
        (activeId === id ? "border-white" : "border-gray")
      }
    >
      {children}
    </div>
  );
};

const SideDropWrapper = ({
  item,
  depth,
  children,
  handleDragLeave,
}: {
  item: Layout;
  depth: number;
  handleDragLeave: () => void;
  children: React.ReactNode;
}) => {
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const dispatch = useAppDispatch();
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";
  // Calculate the margin based on depth, capping it at ml-4
  const marginLeftClass = depth === 0 ? "ml-2" : depth === 1 ? "ml-5" : "ml-7";

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

  return (
    <div className="relative">
      <div
        onClick={() => handleAddLocationClick("before")}
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "before")}
        onDragLeave={handleDragLeave}
        className={
          "absolute -top-3 left-0 right-0 m-2 h-2 hover:bg-gray " +
          marginLeftClass +
          (beforeSelected ? " bg-text hover:bg-text" : "")
        }
      ></div>
      <div className={"m-2 " + marginLeftClass}>{children} </div>
      <div
        onClick={() => {
          handleAddLocationClick("after");
        }}
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "after")}
        onDragLeave={handleDragLeave}
        className={
          "absolute -bottom-3 left-0 right-0 m-2 h-2 hover:bg-gray " +
          marginLeftClass +
          (afterSelected ? " bg-text hover:bg-text" : "")
        }
      ></div>
    </div>
  );
};

const AddSection = () => {
  const availableElements = Object.keys(componentList);
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const addLocation = useAppSelector(selectAddLocation);

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
    <div className="flex justify-center relative z-10 p-1">
      <AddButton onClick={() => setToggle((prev) => !prev)} />
      {toggle && (
        <div
          ref={ref}
          className="absolute top-full border rounded border-text p-3 bg-background flex flex-wrap"
        >
          {availableElements.map((item, i) => (
            <button
              key={i}
              className="rounded hover:shadow-sm hover:shadow-text hover:z-50 p-3 w-1/3 relative"
              onClick={() => {
                dispatch(addElement({ type: item, addLocation }));
                setToggle(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
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
      <Icon type={type} size="20px" title="Toggle" />
    </button>
  );
};

export default LeftPanel;
