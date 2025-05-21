import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import BottomLine from "../BottomLine";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { getProp } from "@/utils/Helpers";
import LinkInput from "../LinkInput";
import { changeElementProp } from "@/redux/slices/editorSlice";
import TextInput from "../TextInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Popup from "../Popup";
import { getAction } from "@/utils/serverActions/imageActions";
import { toast } from "react-toastify";
import Image from "next/image";

const Source = () => {
  const activeType = useAppSelector(selectActive)?.type;

  return (
    <ToggleVisibilityWrapper title="Source" desc="Add the source of your media">
      <SourceUrl />
      {activeType === "image" && <AltText />}
    </ToggleVisibilityWrapper>
  );
};

const SourceUrl = () => {
  const type = "src";
  const activeType = useAppSelector(selectActive)?.type;
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative pb-2 mb-2">
      <div className="flex flex-col gap-2 items-center">
        {activeType === "image" && (
          <button
            onClick={() => setPopup(true)}
            className="p-2 bg-text text-background"
          >
            Upload
          </button>
        )}
        <p className="font-bold italic">Or</p>
      </div>
      <LinkInput
        desc={
          activeType === "image"
            ? "should be apng, avif, gif, jpeg, png (recommended), svg or webp (recommended)"
            : activeType === "video"
            ? "should be mp4, webm or ogg"
            : activeType === "audio"
            ? "should be mp3, wav or ogg"
            : ""
        }
        title="Source url"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      {popup && (
        <Popup
          onClose={() => setPopup(false)}
          loading={loading}
          editing={false}
          maxWidth="4xl"
          onEditOrAdd={() => {}}
        >
          <ImageUploader />
        </Popup>
      )}
      <BottomLine />
    </div>
  );
};
const AltText = () => {
  const type = "alt";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <TextInput
        title="Alternative text (accessibility)"
        desc="Add a text to this image that will be used by screen readers and will be visible if image is not available"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
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

const ImageUploader = () => {
  const [type, setType] = useState("owned");
  return (
    <div className="">
      <TypeSelect type={type} setType={setType} />
      <ImagesList type={type} />
    </div>
  );
};

export const TypeSelect = ({
  setType,
  type,
}: {
  setType: Dispatch<SetStateAction<string>>;
  type: string;
}) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      {["Owned", "Library"].map((item) => (
        <TypeItem
          key={item}
          globalType={type}
          item={item}
          onClick={() => setType(type)}
        />
      ))}
    </div>
  );
};
const TypeItem = ({
  onClick,
  item,
  globalType,
}: {
  item: string;
  onClick: () => void;
  globalType: string;
}) => {
  return (
    <div
      className={
        "text-background  p-2 cursor-pointer " +
        (item === globalType ? " bg-gray" : "bg-text")
      }
      onClick={onClick}
    >
      {item}
    </div>
  );
};

const ImagesList = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<
    { url: string; size: number; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { images, error } = await getAction();

      if (error) {
        toast.error(error);
      } else {
        setImages(images?.images || []);
      }

      setLoading(false);
    };

    if (type === "owned") fetchImages();
  }, [type]);

  const handleSelect = (url: string) => {
    dispatch(
      changeElementProp({
        type: "src",
        newValue: url,
      })
    );
  };

  if (loading) return <p>Loading...</p>;

  if (!images.length) return <p>No images found.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {images.map((img) => (
        <div
          key={img.url}
          onClick={() => handleSelect(img.url)}
          className="cursor-pointer border hover:border-blue-500 rounded p-2"
        >
          <Image
            src={img.url}
            alt="User image"
            width={200}
            height={200}
            className="w-full h-auto object-cover"
          />
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(img.size / 1024)} KB
          </p>
        </div>
      ))}
    </div>
  );
};
export default Source;
