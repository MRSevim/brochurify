"use client";
import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FocusWrapper from "./FocusWrapper";
import { componentList } from "@/utils/Helpers";
import { SetStateAction, Dispatch, useState, useRef, useEffect } from "react";
import { addElement, deleteElement } from "@/redux/slices/editorSlice";
import Icon from "./Icon";
import { AddLocation, Layout } from "@/utils/Types";

type VisibilityMap = Map<string, boolean>;

const LeftPanel = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [toggle] = LayoutToggleContext.Use();
  // Centralized visibility map state
  const [visibilityMap, setVisibilityMap] = useState<VisibilityMap>(new Map());
  const depth = 0;
  const [addLocation, setAddLocation] = useState<AddLocation>(null);

  return (
    <PanelWrapper toggle={toggle} from="left">
      <AddSection addLocation={addLocation} />
      <ul className="overflow-y-auto max-h-scrollable-container	">
        {data?.map((item) => {
          return (
            <section key={item.id}>
              <LayoutItem
                item={item}
                depth={depth}
                visibilityMap={visibilityMap}
                setVisibilityMap={setVisibilityMap}
                addLocation={addLocation}
                setAddLocation={setAddLocation}
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
  addLocation,
  setAddLocation,
}: {
  item: Layout;
  depth: number;
  visibilityMap: VisibilityMap;
  setVisibilityMap: Dispatch<SetStateAction<VisibilityMap>>;
  addLocation: AddLocation;
  setAddLocation: Dispatch<SetStateAction<AddLocation>>;
}) => {
  const active = useAppSelector((state) => state.editor.active);
  const id = item.id;
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

  return (
    <>
      <section className="relative">
        <section
          onClick={() => {
            if (addLocation) {
              setAddLocation(null);
            } else setAddLocation({ id, where: "before" });
          }}
          className={
            "absolute -top-3 left-0 right-0 m-2 h-1 hover:bg-gray-800 " +
            marginLeftClass +
            (beforeSelected ? " bg-light hover:bg-light" : "")
          }
        ></section>
        <FocusWrapper itemId={id}>
          <li
            className={
              "m-2 p-2 border flex items-center justify-between	" +
              (active === id ? "border-light" : "border-slate-500") +
              (" " + marginLeftClass)
            }
          >
            <section>
              {item.props.child && (
                <ToggleButton toggled={isExpanded} onClick={toggleVisibility} />
              )}
              {item.type}
            </section>
            <DeleteButton itemId={id} />
          </li>
        </FocusWrapper>
        <section
          onClick={() => {
            if (addLocation) {
              setAddLocation(null);
            } else setAddLocation({ id, where: "after" });
          }}
          className={
            "absolute -bottom-3 left-0 right-0 m-2 h-1 hover:bg-gray-800 " +
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
              addLocation={addLocation}
              setAddLocation={setAddLocation}
            />
          ))}
        </ul>
      )}
    </>
  );
};

const AddSection = ({ addLocation }: { addLocation: AddLocation }) => {
  const availableElements = Object.keys(componentList);
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLElement | null>(null);

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
