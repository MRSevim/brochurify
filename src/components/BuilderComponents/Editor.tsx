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
        const id = item.id;
        return (
          <FocusWrapper key={id} itemId={id}>
            <section
              className={
                active === id ? "inline-block p-1 border border-dark" : ""
              }
            >
              {renderComponent(item)}
            </section>
          </FocusWrapper>
        );
      })}
    </section>
  );
};

export default Editor;

const renderComponent = (item: Layout): React.ReactNode => {
  const Component = componentList[item.type as keyof typeof componentList];

  // Recursively render the single child if it exists
  const childNode = item.props.children
    ? renderComponent(item.props.children)
    : null;

  return (
    <Component key={item.id} {...item.props}>
      {childNode}
    </Component>
  );
};
