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
  setActive,
  setAddLocation,
} from "@/redux/slices/editorSlice";
import Icon from "./Icon";
import { Layout, Where } from "@/utils/Types";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import { useAddSectionToggle } from "@/contexts/AddSectionToggleContext";

type VisibilityMap = Map<string, boolean>;

const LeftPanel = () => {
  const [toggle] = LayoutToggleContext.Use();

  return (
    <PanelWrapper toggle={toggle} from="left" zIndex="10">
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
      <div className="overflow-auto gutter-stable z-10 py-2">
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
            setVisibilityMap={setVisibilityMap}
            handleDragLeave={handleDragLeave}
          >
            <div className="flex items-center">
              {item.props.child && item.props.child.length > 0 && (
                <ToggleButton toggled={isExpanded} onClick={toggleVisibility} />
              )}
              {item.type}
            </div>

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
              depth={depth + 1}
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
  setVisibilityMap,
  children,
  handleDragLeave,
}: {
  item: Layout;
  handleDragLeave: () => void;
  children: React.ReactNode;
  setVisibilityMap: Dispatch<SetStateAction<VisibilityMap>>;
}) => {
  const activeId = useAppSelector(selectActive)?.id;
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);
  const [, setToggle] = useAddSectionToggle();

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
    reveal(addLocation?.id, layout);
  }, [activeId, addLocation]);
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
        "p-1 border flex items-center justify-between me-1 relative " +
        (activeId === id ? "border-green-500" : "border-gray")
      }
    >
      {" "}
      <div
        onClick={(e) => {
          setToggle(true);
          dispatch(setActive(item));
          e.stopPropagation();
        }}
        className="z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-hoveredBlue opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        +
      </div>
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
  const [, setToggle] = useAddSectionToggle();
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";
  const commonClasses =
    "cursor-pointer absolute flex justify-center align-center left-0 right-0 ms-2 me-4 h-1 opacity-0 hover:opacity-100 transition-opacity duration-200 ";
  const selectedClasses = "opacity-100 bg-activeBlue";

  const handleAddLocationClick = (where: Where) => {
    if (addLocation && addLocation.id === id && addLocation.where === where) {
      dispatch(setAddLocation(null));
    } else {
      dispatch(setAddLocation({ id, where }));
      setToggle(true);
    }
  };

  const handleSideDrop = (e: DragEvent<HTMLElement>) => {
    handleSideDropCaller(e, dispatch, id);
  };

  const handleSideDragOver = (e: DragEvent<HTMLElement>, where: Where) => {
    handleSideDragOverCaller({ e, id, where, dispatch });
  };

  const marginLeftStyle = { marginLeft: depth * 8 };

  const AddSign = () => (
    <div className="z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-inherit">
      +
    </div>
  );

  return (
    <div className="relative">
      <div
        onClick={() => handleAddLocationClick("before")}
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "before")}
        onDragLeave={handleDragLeave}
        className={
          commonClasses +
          "bottom-full " +
          (beforeSelected ? selectedClasses : "bg-hoveredBlue")
        }
        style={marginLeftStyle}
      >
        <AddSign />
      </div>
      <div className="m-2 min-w-40" style={marginLeftStyle}>
        {children}{" "}
      </div>
      <div
        onClick={() => {
          handleAddLocationClick("after");
        }}
        onDrop={handleSideDrop}
        onDragOver={(e) => handleSideDragOver(e, "after")}
        onDragLeave={handleDragLeave}
        className={
          commonClasses +
          "top-full " +
          (afterSelected ? selectedClasses : "bg-hoveredBlue")
        }
        style={marginLeftStyle}
      >
        <AddSign />
      </div>
    </div>
  );
};

const AddSection = () => {
  const availableElements = Object.keys(componentList);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const addLocation = useAppSelector(selectAddLocation);
  const [toggle, setToggle] = useAddSectionToggle();

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
    <div className="flex justify-center relative z-20 p-1">
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
