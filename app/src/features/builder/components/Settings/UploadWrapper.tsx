import React, { useEffect, useRef, useState } from "react";
import WrapperWithBottomLine from "../WrapperWithBottomLine";
import Popup from "@/components/Popup";
import MiniLoadingSvg from "@/components/MiniLoadingSvg";
import {
  deleteAction,
  getAction,
  uploadAction,
} from "@/features/auth/utils/serverActions/imageActions";
import { toast } from "react-toastify";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton";
import { useUser } from "@/features/auth/utils/contexts/UserContext";
import { useSubscribePopup } from "@/features/auth/utils/contexts/SubscribePopupContext";
import {
  ALLOWED_ICON_TYPES,
  ALLOWED_IMAGE_TYPES,
} from "@/features/auth/utils/AllowedImageTypes";

const UploadWrapper = ({
  icon = false,
  onEditOrAdd,
  children,
}: {
  children: React.ReactNode;
  icon?: boolean;
  onEditOrAdd: (e: string) => void;
}) => {
  const [popup, setPopup] = useState(false);
  const [isSubbed, setSubPopup] = useSubscribePopup();
  const [user] = useUser();
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  if (!user) return <>{children}</>;

  return (
    <WrapperWithBottomLine>
      <div className="flex flex-col gap-2 items-center">
        <Button
          text="Image Library"
          onClick={() => {
            if (!isSubbed) {
              setSubPopup(true);
            } else setPopup(true);
          }}
        />
        <p className="font-bold italic">Or</p>
      </div>
      {children}
      {popup && (
        <Popup
          positiveActionText="Use"
          onClose={() => setPopup(false)}
          editing={false}
          className="max-w-4xl"
          onEditOrAdd={() => {
            onEditOrAdd(selectedImageUrl);
            setPopup(false);
          }}
        >
          <ImageUploader
            icon={icon}
            selectedImageUrl={selectedImageUrl}
            setSelectedImageUrl={setSelectedImageUrl}
          />
        </Popup>
      )}
    </WrapperWithBottomLine>
  );
};

const Button = ({
  text,
  onClick,
  loading = false,
}: {
  text: string;
  onClick: () => void;
  loading?: boolean;
}) => {
  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={onClick}
        className="p-2 bg-text text-background"
      >
        {!loading && text}
        {loading && <MiniLoadingSvg />}
      </button>
    </div>
  );
};

type Images = { url: string; size: number; createdAt: string }[];

const ImageUploader = ({
  icon,
  selectedImageUrl,
  setSelectedImageUrl,
}: {
  icon: boolean;
  selectedImageUrl: string;
  setSelectedImageUrl: React.Dispatch<React.SetStateAction<string>>;
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
        const allImages = images?.images || [];

        const getExtsFromMimeTypes = (types: string[]) =>
          types.map((type) => "." + type.split("/")[1]);

        const allowedExts = icon
          ? getExtsFromMimeTypes(ALLOWED_ICON_TYPES)
          : getExtsFromMimeTypes(ALLOWED_IMAGE_TYPES);

        const filtered = allImages.filter((img) => {
          const url = img.url || ""; // assuming each image has a `url` or `name`
          return allowedExts.some((ext) => url.toLowerCase().endsWith(ext));
        });

        setImages(filtered);
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

      const { newImage, error } = await uploadAction(base64, fileType, icon);
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
    <div>
      <ImagesList
        setImages={setImages}
        selectedImageUrl={selectedImageUrl}
        setSelectedImageUrl={setSelectedImageUrl}
        loading={fetchLoading}
        images={images}
      />
      <div className="my-2 flex justify-center">
        <Button
          text="Upload"
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
  setSelectedImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImages: React.Dispatch<React.SetStateAction<Images>>;
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
            src={`${img.url}`}
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
                    prev.filter((image) => image.url !== img.url),
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

export default UploadWrapper;
