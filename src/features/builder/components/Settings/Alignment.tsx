import { ResetButtonWithType } from "@/features/builder/components/ResetButton";
import Select from "@/components/Select";
import SmallText from "@/components/SmallText";
import ToggleVisibilityWrapper from "@/features/builder/components/ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import { getSetting } from "@/features/builder/utils/helpers";
import Checkbox from "@/components/Checkbox";
import WrapperWithBottomLine from "../WrapperWithBottomLine";
import Slider from "@/components/Slider";
import { selectActiveType } from "../../lib/redux/selectors";
import { CONFIG, OptionsObject } from "../../utils/types/types.d";

const justifyContentAlignmentOptionsForRow = [
  {
    value: "start",
    title: "Left",
  },
  { value: "center", title: "Center" },
  { value: "end", title: "Right" },
  {
    value: "space-between",
    title: "Space evenly (with no space in start and end)",
  },
  {
    value: "space-around",
    title: "Space evenly (with space in start and end)",
  },
];
const alignItemsAlignmentOptionsForRow = [
  {
    value: "start",
    title: "Top",
  },
  {
    value: "center",
    title: "Center",
  },
  {
    value: "end",
    title: "Bottom",
  },
  {
    value: "stretch",
    title: "Stretch",
  },
];
const justifyContentAlignmentOptionsForColumn = [
  {
    value: "start",
    title: "Top",
  },
  { value: "center", title: "Center" },
  { value: "end", title: "Bottom" },
  {
    value: "space-between",
    title: "Space evenly (with no space in start and end)",
  },
  {
    value: "space-around",
    title: "Space evenly (with space in start and end)",
  },
];
const alignItemsAlignmentOptionsForColumn = [
  {
    value: "start",
    title: "Left",
  },
  {
    value: "center",
    title: "Center",
  },
  {
    value: "end",
    title: "Right",
  },
  {
    value: "stretch",
    title: "Stretch",
  },
];

const Alignment = () => {
  const activeType = useAppSelector(selectActiveType);
  const isRow = activeType === "row";
  const otherAlignable =
    activeType === "column" ||
    activeType === "container" ||
    activeType === "fixed" ||
    activeType === "button";
  return (
    <ToggleVisibilityWrapper
      title="Alignment"
      desc="Change the alignment of items inside"
    >
      {isRow && (
        <>
          <HorizontalOrVertical
            type="justify-content"
            title="Horizontal alignment"
            options={justifyContentAlignmentOptionsForRow}
          />
          <HorizontalOrVertical
            type="align-items"
            title="Vertical alignment"
            options={alignItemsAlignmentOptionsForRow}
          />
        </>
      )}
      {otherAlignable && (
        <>
          <HorizontalOrVertical
            type="justify-content"
            title="Vertical alignment"
            options={justifyContentAlignmentOptionsForColumn}
          />
          <HorizontalOrVertical
            type="align-items"
            title="Horizontal alignment"
            options={alignItemsAlignmentOptionsForColumn}
          />
        </>
      )}

      {isRow && <Reverse />}
      <Gap />
    </ToggleVisibilityWrapper>
  );
};

const Gap = () => {
  const type = "gap";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <Slider
        title="Set the gap between elements inside this element"
        step={1}
        units={["px", "em", "%"]}
        value={variable || "0px"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            }),
          )
        }
      />
      <ResetButtonWithType type={type} />
    </WrapperWithBottomLine>
  );
};

const Reverse = () => {
  return (
    <WrapperWithBottomLine>
      <TabletOrMobile
        title="Reverse on tablet and below *"
        outerType={CONFIG.possibleOuterTypes.tabletContainerQuery}
      />
      <TabletOrMobile
        title="Reverse on mobile and below *"
        outerType={CONFIG.possibleOuterTypes.mobileContainerQuery}
      />
      <SmallText text="*Only reverses if items are stacked" />
    </WrapperWithBottomLine>
  );
};

const TabletOrMobile = ({
  title,
  outerType,
}: {
  title: string;
  outerType: string;
}) => {
  const reverse = "wrap-reverse";
  const innerType = "flex-wrap";
  const variable = getSetting(useAppSelector, outerType, innerType);
  const dispatch = useAppDispatch();
  const checked = variable === reverse;

  return (
    <Checkbox
      title={title}
      checked={checked}
      onChange={() => {
        dispatch(
          changeElementStyle({
            types: [outerType, innerType],
            newValue: checked ? "" : reverse,
          }),
        );
      }}
    />
  );
};

const HorizontalOrVertical = ({
  type,
  title,
  options,
}: {
  type: string;
  title: string;
  options: OptionsObject[] | string[];
}) => {
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <Select
        title={title}
        showStyled={false}
        options={options}
        selected={variable || ""}
        onChange={(e) => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: e.target.value,
            }),
          );
        }}
      />
      <ResetButtonWithType type={type} />
    </WrapperWithBottomLine>
  );
};

export default Alignment;
