import { setActive } from "@/redux/slices/editorSlice";
import { useAppDispatch } from "@/redux/store";

const FocusWrapper = ({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  return (
    <section
      className="cursor-pointer"
      key={itemId}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActive(itemId));
      }}
      onBlur={() => dispatch(setActive(undefined))}
    >
      {children}
    </section>
  );
};

export default FocusWrapper;
