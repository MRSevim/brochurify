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
import { componentList } from "@/utils/ComponentsList";
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
  handleDrop,
  setActive,
  setAddLocation,
} from "@/redux/slices/editorSlice";
import Icon from "./Icon";
import { Layout, Where } from "@/utils/Types";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import {
  useAddSectionToggleSetter,
  useAddSectionToggleState,
} from "@/contexts/AddSectionToggleContext";

type VisibilityMap = Map<string, boolean>;

const LeftPanel = () => {
  const toggle = LayoutToggleContext.useToggle();

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

  return (
    <>
      <SideDropWrapper depth={depth} item={item}>
        <FocusWrapper id={item.id}>
          <CenterDropWrapper item={item} setVisibilityMap={setVisibilityMap}>
            <div className="flex items-center">
              {item.props.child && item.props.child.length > 0 && (
                <ToggleButton toggled={isExpanded} onClick={toggleVisibility} />
              )}
              <div className="ms-2">{item.type}</div>
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
}: {
  item: Layout;
  children: React.ReactNode;
  setVisibilityMap: Dispatch<SetStateAction<VisibilityMap>>;
}) => {
  const activeId = useAppSelector(selectActive);
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);
  const setToggle = useAddSectionToggleSetter();
  const [draggingOver, setDraggingOver] = useState(false);
  const active = activeId === id || draggingOver;

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
        e.preventDefault();
        setDraggingOver(false);
        dispatch(handleDrop({ targetId: id, addLocation: null }));
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggingOver(true);
      }}
      onDragLeave={() => setDraggingOver(false)}
      className={
        "p-1 border flex items-center justify-between me-1 relative " +
        (active ? "border-positiveGreen" : "border-gray")
      }
    >
      {" "}
      <div
        onClick={(e) => {
          setToggle(true);
          dispatch(setActive(item.id));
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
}: {
  item: Layout;
  depth: number;
  children: React.ReactNode;
}) => {
  const addLocation = useAppSelector(selectAddLocation);
  const id = item.id;
  const dispatch = useAppDispatch();
  const setToggle = useAddSectionToggleSetter();
  const beforeSelected =
    addLocation?.id === id && addLocation?.where === "before";
  const afterSelected =
    addLocation?.id === id && addLocation?.where === "after";

  const handleAddLocationClick = (where: Where) => {
    if (addLocation && addLocation.id === id && addLocation.where === where) {
      dispatch(setAddLocation(null));
    } else {
      dispatch(setAddLocation({ id, where }));
      setToggle(true);
    }
  };

  const handleSideDrop = (e: DragEvent<HTMLElement>, where: Where) => {
    e.preventDefault();
    dispatch(
      handleDrop({
        targetId: undefined,
        addLocation: {
          id,
          where,
        },
      })
    );
  };

  const marginLeftStyle = { marginLeft: depth * 8 };

  return (
    <div className="relative" style={marginLeftStyle}>
      <SideDropZone
        extraClass="bottom-full "
        onClick={() => handleAddLocationClick("before")}
        onDrop={(e) => handleSideDrop(e, "before")}
        selected={beforeSelected}
      />
      <div className="m-2 min-w-40">{children} </div>
      <SideDropZone
        extraClass="top-full "
        onClick={() => handleAddLocationClick("after")}
        onDrop={(e) => handleSideDrop(e, "after")}
        selected={afterSelected}
      />
    </div>
  );
};

const SideDropZone = ({
  onDrop,
  onClick,
  extraClass,
  selected,
}: {
  onDrop: (e: DragEvent<HTMLElement>) => void;
  selected: boolean;
  extraClass: string;
  onClick: () => void;
}) => {
  const [draggingOver, setDraggingOver] = useState(false);
  const commonClasses =
    "cursor-pointer absolute flex justify-center align-center left-0 right-0 ms-2 me-4 h-1 opacity-0 hover:opacity-100 transition-opacity duration-200 ";
  const selectedClasses = "opacity-100 bg-activeBlue";
  const AddSign = () => (
    <div className="z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-inherit">
      +
    </div>
  );
  return (
    <div
      onClick={onClick}
      onDrop={(e) => {
        setDraggingOver(false);
        onDrop(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggingOver(true);
      }}
      onDragLeave={() => setDraggingOver(false)}
      className={
        commonClasses +
        extraClass +
        (draggingOver || selected ? selectedClasses : "bg-hoveredBlue")
      }
    >
      <AddSign />
    </div>
  );
};

const AddSection = () => {
  const availableElements = Object.keys(componentList);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const addLocation = useAppSelector(selectAddLocation);
  const setToggle = useAddSectionToggleSetter();
  const toggle = useAddSectionToggleState();

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

export const ToggleButton = ({
  onClick,
  toggled,
}: {
  onClick: () => void;
  toggled: boolean;
}) => {
  const type = toggled ? "chevron-up" : "chevron-down";
  return (
    <button
      className="p-1"
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
