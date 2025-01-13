import { LayoutToggleContext } from "@/contexts/ToggleContext";
import PanelWrapper from "./PanelWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import FocusWrapper from "./FocusWrapper";
import { componentList } from "@/utils/Helpers";
import { useState } from "react";
import { addElement, deleteElement } from "@/redux/slices/editorSlice";
import Icon from "./Icon";

const LeftPanel = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [toggle] = LayoutToggleContext.Use();
  return (
    <PanelWrapper toggle={toggle} from="left">
      <AddSection />
      <ul>
        {data?.map((item, i) => {
          return <LayoutItem key={item.id} id={item.id} type={item.type} />;
        })}
      </ul>
    </PanelWrapper>
  );
};

interface LayoutItemProps {
  type: string;
  id: string;
}

const LayoutItem = ({ type, id }: LayoutItemProps) => {
  const active = useAppSelector((state) => state.editor.active);
  return (
    <FocusWrapper itemId={id}>
      <li
        className={
          "m-3 p-3 mx-5 border flex items-center justify-between	" +
          (active === id ? "border-light" : "border-slate-500")
        }
      >
        {type}
        <DeleteButton itemId={id} />
      </li>
    </FocusWrapper>
  );
};

const AddSection = () => {
  const availableElements = Object.keys(componentList);
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <section className="flex justify-center relative">
      <button
        onBlur={() => setToggle(false)}
        className="border rounded border-cyan-100	p-3"
        onClick={() => setToggle((prev) => !prev)}
      >
        Add +
      </button>
      {toggle && (
        <section className="absolute top-full border rounded border-cyan-100 mt-2	p-3 bg-dark">
          {availableElements.map((item, i) => (
            <li
              key={i}
              className="list-none cursor-pointer rounded hover:bg-gray-800 p-3"
              onClick={() => {
                dispatch(addElement(item));
                setToggle(false);
              }}
            >
              {item}
            </li>
          ))}
        </section>
      )}
    </section>
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
