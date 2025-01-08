import { useNode } from "@craftjs/core";

const Container = ({ children }: { children: React.ReactNode }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="mx-2">
      {children}
    </div>
  );
};

Container.craft = {
  rules: {
    canDrag: (node) => node.data.props.text != "Drag",
  },
};

export default Container;
