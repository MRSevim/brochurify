import Image from "next/image";
import marginBorderPadding from "../../../public/margin-border-padding.webp";
import Sizing from "./Sizing";

const ElementSettings = () => {
  return (
    <section className="m-2">
      <Image
        src={marginBorderPadding}
        alt="Margin, border, padding schema"
        className="mb-2"
      />
      <Sizing />
    </section>
  );
};

export default ElementSettings;
