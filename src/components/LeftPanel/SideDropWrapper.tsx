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
  firstItem,
  id,
  depth,
  children,
}: {
  id: string;
  firstItem: boolean;
  depth: number;
  children: React.ReactNode;
}) => {
  const marginLeftStyle = { marginLeft: depth * 8 };

  return (
    <div className="relative" style={marginLeftStyle}>
      {firstItem && <SideDropZone where="before" id={id} />}
      <div className="mx-2 min-w-40">{children} </div>
      <SideDropZone where="after" id={id} />
    </div>
  );
};
const SideDropZone = memo(({ id, where }: { id: string; where: Where }) => {
  const addLocation = useAppSelector(selectAddLocation);
  const dispatch = useAppDispatch();
  const setToggle = useAddSectionToggleSetter();
  const selected = addLocation?.id === id && addLocation?.where === where;
  const [draggingOver, setDraggingOver] = useState(false);
  const active = draggingOver || selected;

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
      className={`cursor-pointer transition-all duration-300 opacity-0 hover:opacity-100 h-[8px] hover:h-[64px] cursor-pointer overflow-hidden ${active ? "opacity-100 h-[64px]" : ""}`}
    >
      <div
        className={
          "flex justify-center items-center min-w-40 h-[48px] m-[8px] " +
          (active ? " bg-activeBlue" : " bg-hoveredBlue")
        }
      >
        <AddSign />
      </div>
    </div>
  );
});
const AddSign = memo(() => {
  return <div className="z-40 text-sm p-px px-1">+</div>;
});

export default SideDropWrapper;
