import { setActive } from "@/redux/slices/editorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FocusWrapper = ({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.editor.active);
  return (
    <section
      className="cursor-pointer"
      key={itemId}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (active === itemId) {
          dispatch(setActive(undefined));
        } else dispatch(setActive(itemId));
      }}
    >
      {children}
    </section>
  );
};

export default FocusWrapper;
