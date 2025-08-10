import { useAddSectionToggleSetter } from "@/contexts/AddSectionToggleContext";
import {
  selectAddLocation,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { handleDrop, setAddLocation } from "@/redux/slices/editorSlice";
import { Where } from "@/utils/Types";
import { DragEvent, memo, useState } from "react";

const SideDropWrapper = ({
  id,
  depth,
  children,
}: {
  id: string;
  depth: number;
  children: React.ReactNode;
}) => {
  const marginLeftStyle = { marginLeft: depth * 8 };

  return (
    <div className="relative" style={marginLeftStyle}>
      <SideDropZone extraClass="bottom-full " where="before" id={id} />
      <div className="m-2 min-w-40">{children} </div>
      <SideDropZone extraClass="top-full " where="after" id={id} />
    </div>
  );
};
const SideDropZone = memo(
  ({
    id,
    extraClass,
    where,
  }: {
    id: string;
    extraClass: string;
    where: Where;
  }) => {
    const addLocation = useAppSelector(selectAddLocation);
    const dispatch = useAppDispatch();
    const setToggle = useAddSectionToggleSetter();
    const selected = addLocation?.id === id && addLocation?.where === where;
    const [draggingOver, setDraggingOver] = useState(false);
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
    return (
      <div
        onClick={() => handleAddLocationClick(where)}
        onDrop={(e) => {
          setDraggingOver(false);
          handleSideDrop(e, where);
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
  }
);
const AddSign = () => (
  <div className="z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm p-px px-1 rounded bg-inherit">
    +
  </div>
);

export default SideDropWrapper;
