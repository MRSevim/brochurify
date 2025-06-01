import TextInput from "@/components/TextInput";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import { getSetting } from "@/utils/Helpers";

const Analytics = () => {
  const type = "googleAnalyticsTag";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <WrapperWithBottomLine>
      <TextInput
        title="Google analytics tag"
        desc="Paste your full google analytics tag that starts with G- here"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: e.target.value,
            })
          )
        }
      />
    </WrapperWithBottomLine>
  );
};
export default Analytics;
