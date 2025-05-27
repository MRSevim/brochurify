import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { getProp } from "@/utils/Helpers";
import LinkInput from "../LinkInput";
import { changeElementProp } from "@/redux/slices/editorSlice";
import TextInput from "../TextInput";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Popup from "../Popup";
import {
  deleteAction,
  getAction,
  uploadAction,
} from "@/utils/serverActions/imageActions";
import { toast } from "react-toastify";
import Image from "next/image";
import MiniLoadingSvg from "../MiniLoadingSvg";
import DeleteButton from "../DeleteButton";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  return (
    <WrapperWithBottomLine>
      <div className="flex flex-col gap-2 items-center">
        {activeType === "image" && (
          <UploadButton onClick={() => setPopup(true)} />
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
          positiveActionText="Use"
          onClose={() => setPopup(false)}
          editing={false}
          maxWidth="4xl"
          onEditOrAdd={() => {
            dispatch(
              changeElementProp({
                type,
                newValue: selectedImageUrl,
              })
            );
            setPopup(false);
          }}
        >
          <ImageUploader
            selectedImageUrl={selectedImageUrl}
            setSelectedImageUrl={setSelectedImageUrl}
          />
        </Popup>
      )}
    </WrapperWithBottomLine>
  );
};

const UploadButton = ({
  onClick,
  loading = false,
}: {
  onClick: () => void;
  loading?: boolean;
}) => {
  return (
    <button onClick={onClick} className="p-2 bg-text text-background">
      {!loading && "Upload"}
      {loading && <MiniLoadingSvg variant="black" />}
    </button>
  );
};
const AltText = () => {
  const type = "alt";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
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
    </WrapperWithBottomLine>
  );
};
type Images = { url: string; size: number; createdAt: string }[];

const ImageUploader = ({
  selectedImageUrl,
  setSelectedImageUrl,
}: {
  selectedImageUrl: string;
  setSelectedImageUrl: Dispatch<SetStateAction<string>>;
}) => {
  const [images, setImages] = useState<Images>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setFetchLoading(true);
      const { images, error } = await getAction();

      if (error) {
        toast.error(error);
      } else {
        setImages(images?.images || []);
      }

      setFetchLoading(false);
    };

    fetchImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1];
      if (!base64) return;

      setUploadLoading(true);
      const fileType = file.type;

      const { newImage, error } = await uploadAction(base64, fileType);
      if (error) {
        toast.error(error);
      } else if (newImage) {
        setImages((prev) => [...prev, newImage]);
      }

      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="">
      <ImagesList
        setImages={setImages}
        selectedImageUrl={selectedImageUrl}
        setSelectedImageUrl={setSelectedImageUrl}
        loading={fetchLoading}
        images={images}
      />
      <div className="my-2 flex justify-center">
        <UploadButton
          onClick={() => fileInputRef.current?.click()}
          loading={uploadLoading}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

const ImagesList = ({
  setImages,
  selectedImageUrl,
  setSelectedImageUrl,
  images,
  loading,
}: {
  setSelectedImageUrl: Dispatch<SetStateAction<string>>;
  setImages: Dispatch<SetStateAction<Images>>;
  selectedImageUrl: string;
  loading: boolean;
  images: Images;
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  if (loading) return <p>Loading...</p>;

  if (!images.length) return <p>No images found.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto">
      {images.map((img) => (
        <div
          key={img.url}
          onClick={() => setSelectedImageUrl(img.url)}
          className={
            "cursor-pointer border rounded p-2 flex flex-col " +
            (img.url === selectedImageUrl
              ? "border-activeBlue"
              : "border-gray hover:border-hoveredBlue")
          }
        >
          <Image
            src={img.url}
            alt="User image"
            width={187}
            height={144}
            className="w-full"
          />

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(img.size / 1024)} KB
            </p>
            <DeleteButton
              loading={deleteLoading}
              onClick={async (e) => {
                e.stopPropagation();
                setDeleteLoading(true);
                const { error } = await deleteAction(img.url);
                if (error) {
                  toast.error(error);
                } else {
                  setImages((prev) =>
                    prev.filter((image) => image.url !== img.url)
                  );
                }
                setDeleteLoading(false);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default Source;
