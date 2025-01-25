import Image from "next/image";
import marginBorderPadding from "../../../public/margin-border-padding.webp";
import SizingAndBorder from "./SizingAndBorder";

const ElementSettings = () => {
  return (
    <section className="m-2">
      <Image
        src={marginBorderPadding}
        alt="Margin, border, padding schema"
        className="mb-2"
      />
      <SizingAndBorder />
    </section>
  );
};

export default ElementSettings;
