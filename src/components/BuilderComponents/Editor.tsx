import { componentList } from "@/utils/Helpers";
import { LayoutToggleContext } from "@/contexts/ToggleContext";
import { useAppSelector } from "@/redux/store";
import FocusWrapper from "../FocusWrapper";
import { Layout } from "@/utils/Types";

const Editor = () => {
  const data = useAppSelector((state) => state.editor.layout);
  const [layoutToggle] = LayoutToggleContext.Use();
  const active = useAppSelector((state) => state.editor.active);

  return (
    <section
      className={
        "relative p-3 " +
        (layoutToggle ? "left-full sm:left-96 w-screen-layout-excluded" : "")
      }
    >
      {data?.map((item) => {
        return <section key={item.id}>{renderComponent(item, active)}</section>;
      })}
    </section>
  );
};

export default Editor;

const renderComponent = (
  item: Layout,
  active: string | undefined
): React.ReactNode => {
  const Component = componentList[item.type as keyof typeof componentList];

  const id = item.id;
  return (
    <FocusWrapper key={id} itemId={id}>
      <section
        className={active === id ? "p-px border border-dark border-dashed" : ""}
      >
        <Component key={item.id} {...item.props}>
          {item.props.child?.map((childItem) =>
            renderComponent(childItem, active)
          )}
        </Component>
      </section>
    </FocusWrapper>
  );
};
