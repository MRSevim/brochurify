import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import BottomLine from "@/components/BottomLine";
import TextInput from "@/components/TextInput";
import { getSetting } from "@/utils/Helpers";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import TextareaInput from "@/components/TextareaInput";
import LinkInput from "@/components/LinkInput";
import SmallText from "@/components/SmallText";

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
      <CanonicalUrl />
      <WebsiteImage />
    </>
  );
};

const WebsiteTitle = () => {
  const type = "title";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <TextInput
        title="Website title"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const WebsiteDescription = () => {
  const type = "description";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <TextareaInput
        rows={5}
        title="Website description"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const WebsiteKeywords = () => {
  const type = "keywords";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <TextareaInput
        rows={3}
        title="Website keywords (Separated by commas)"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const CanonicalUrl = () => {
  const type = "canonical";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <LinkInput
        title="Website's main url (canonical)"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const WebsiteImage = () => {
  const type = "image";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <LinkInput
        title="Website's main image's url"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
export default Seo;
