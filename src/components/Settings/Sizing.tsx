import { useState } from "react";
import Icon from "../Icon";
import Setting from "../Setting";
import Slider from "../Slider";
import { SizingType } from "@/utils/Types";
import { capitalizeFirstLetter } from "@/utils/Helpers";

const paddings: SizingType[] = [
  {
    type: "paddingLeft",
    title: "Left",
  },
  {
    type: "paddingRight",
    title: "Right",
  },
  {
    type: "paddingTop",
    title: "Top",
  },
  {
    type: "paddingBottom",
    title: "Bottom",
  },
];
const margins: SizingType[] = [
  {
    type: "marginLeft",
    title: "Left",
  },
  {
    type: "marginRight",
    title: "Right",
  },
  {
    type: "marginTop",
    title: "Top",
  },
  {
    type: "marginBottom",
    title: "Bottom",
  },
];

const Sizing = () => {
  return (
    <>
      <MarginOrPadding sizingTypeArray={paddings} type="padding" />
      <MarginOrPadding sizingTypeArray={margins} type="margin" />
    </>
  );
};

const MarginOrPadding = ({
  sizingTypeArray,
  type,
}: {
  sizingTypeArray: SizingType[];
  type: string;
}) => {
  const [toggle, setToggle] = useState(false);
  return (
    <section className="relative pb-2">
      <section className="flex justify-between items-center mb-1">
        <h1 className="font-medium text-light ">
          {capitalizeFirstLetter(type)}
        </h1>
        <span onClick={() => setToggle((prev) => !prev)}>
          <Icon
            type={toggle ? "arrows-angle-contract" : "arrows-angle-expand "}
            size="20px"
          />
        </span>
      </section>
      {toggle && (
        <>
          {sizingTypeArray.map((item, i) => (
            <Setting type={item.type} key={i}>
              <Slider min={0} max={50} step={2} title={item.title} />
            </Setting>
          ))}
        </>
      )}
      {!toggle && (
        <Setting type={type} sizingTypeArray={sizingTypeArray}>
          <Slider min={0} max={50} step={2} title={"All sides"} />
        </Setting>
      )}
      <div className="absolute left-0 bottom-0 w-full h-[2px] bg-light rounded"></div>
    </section>
  );
};
export default Sizing;
