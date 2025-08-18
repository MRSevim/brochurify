import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "../PanelWrapper";
import {
  selectAddLocation,
  selectLayout,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import FocusWrapper from "../FocusWrapper";
import { componentList } from "@/utils/ComponentsList";
import { useRef, useEffect, memo, useCallback } from "react";
import { addElement, deleteElement } from "@/redux/slices/editorSlice";
import Icon from "../Icon";
import { Layout } from "@/utils/Types";
import AddButton from "../AddButton";
import DeleteButton from "../DeleteButton";
import {
  useAddSectionToggleSetter,
  useAddSectionToggleState,
} from "@/contexts/AddSectionToggleContext";
import SideDropWrapper from "./SideDropWrapper";
import CenterDropWrapper from "./CenterDropWrapper";
import {
  useVisibilityMapSetter,
  useVisibilityMapState,
  VisibilityMapProvider,
} from "./VisibilityMapContext";

const LeftPanel = () => {
  const toggle = LayoutToggleContext.useToggle();

  return (
    <PanelWrapper toggle={toggle} from="left" zIndex="10">
      <VisibilityMapProvider>
        <LayoutInner />
      </VisibilityMapProvider>
    </PanelWrapper>
  );
};

const LayoutInner = memo(() => {
  const data = useAppSelector(selectLayout);
  // Centralized visibility map state
  const depth = 0;
  return (
    <>
      <AddSection />
      <div className="overflow-auto gutter-stable z-10 py-2">
        {data?.map((item) => {
          return (
            <LayoutItem
              key={item.id}
              id={item.id}
              type={item.type}
              child={item.props.child}
              depth={depth}
            />
          );
        })}
      </div>
    </>
  );
});

const LayoutItem = memo(
  ({
    id,
    type,
    child,
    depth,
  }: {
    child: Layout[] | undefined;
    id: string;
    type: string;
    depth: number;
  }) => {
    const dispatch = useAppDispatch();
    const showButtons = child && child.length > 0;

    const handleDelete = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        dispatch(deleteElement(id));
      },
      [id, dispatch]
    );

    return (
      <>
        <SideDropWrapper depth={depth} id={id}>
          <FocusWrapper id={id}>
            <CenterDropWrapper id={id}>
              {" "}
              <div className="flex items-center">
                {showButtons && <ToggleButton id={id} />}
                <div className="ms-2">{type}</div>
              </div>
              <DeleteButton onClick={handleDelete} />
            </CenterDropWrapper>
          </FocusWrapper>
        </SideDropWrapper>
        <ChildVisibilityWrapper child={child} depth={depth} id={id} />
      </>
    );
  }
);

const ChildVisibilityWrapper = ({
  id,
  depth,
  child,
}: {
  id: string;
  depth: number;
  child: Layout[] | undefined;
}) => {
  const visibilityMap = useVisibilityMapState();
  const isExpanded = visibilityMap.get(id) ?? false;
  return (
    <>
      {isExpanded && (
        <>
          {/* Render child elements recursively */}
          <ChildLayout child={child} depth={depth} />
        </>
      )}
    </>
  );
};
const ChildLayout = memo(
  ({ depth, child }: { depth: number; child: Layout[] | undefined }) => {
    return (
      <>
        {child?.map((childItem) => (
          <LayoutItem
            key={childItem.id}
            id={childItem.id}
            type={childItem.type}
            child={childItem.props.child}
            depth={depth + 1}
          />
        ))}
      </>
    );
  }
);
const AddSection = memo(() => {
  const availableElements = Object.keys(componentList);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const addLocation = useAppSelector(selectAddLocation);
  const setToggle = useAddSectionToggleSetter();
  const toggle = useAddSectionToggleState();

  const handleGeneralClick = (event: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(event.target as HTMLElement) &&
      toggle
    ) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleGeneralClick);

    return () => {
      document.removeEventListener("click", handleGeneralClick);
    };
  }, [toggle]);

  return (
    <div className="flex justify-center relative z-20 p-1">
      <AddButton
        onClick={() => {
          setToggle((prev) => !prev);
        }}
      />
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
});

export const ToggleButton = memo(({ id }: { id: string }) => {
  const visibilityMap = useVisibilityMapState();
  const setVisibilityMap = useVisibilityMapSetter();
  const isExpanded = visibilityMap.get(id) ?? false;
  const type = isExpanded ? "chevron-up" : "chevron-down";

  return (
    <button
      className="p-1"
      onClick={(event) => {
        event.stopPropagation();
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
      }}
    >
      <Icon type={type} size="20px" title="Toggle" />
    </button>
  );
});

export default LeftPanel;
