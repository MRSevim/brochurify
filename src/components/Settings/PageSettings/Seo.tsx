import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import TextInput from "@/components/TextInput";
import { getSetting } from "@/utils/Helpers";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import TextareaInput from "@/components/TextareaInput";
import LinkInput from "@/components/LinkInput";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import UploadWrapper from "../UploadWrapper";

const Seo = () => {
  return (
    <ToggleVisibilityWrapper
      title="Seo"
      desc="Settings for search engine optimization"
    >
      <SeoInner />
    </ToggleVisibilityWrapper>
  );
};

const SeoInner = () => {
  return (
    <>
      <WebsiteTitle />
      <WebsiteDescription />
      <WebsiteKeywords />
      <WebsiteImage />
    </>
  );
};

const WebsiteTitle = () => {
  const type = "title";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <TextInput
        title="Website title"
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
const WebsiteDescription = () => {
  const type = "description";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <TextareaInput
        rows={5}
        title="Website description"
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
const WebsiteKeywords = () => {
  const type = "keywords";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <TextareaInput
        rows={3}
        title="Website keywords (Separated by commas)"
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
const WebsiteImage = () => {
  const type = "image";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <>
      <p className="mb-2 font-bold">Website's main image</p>
      <UploadWrapper
        onEditOrAdd={(newValue) => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            })
          );
        }}
      >
        <LinkInput
          title="Website's main image's url"
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
      </UploadWrapper>
    </>
  );
};
export default Seo;
