import Image from "next/image";

export const ShapshotImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Image
      width={282}
      height={159}
      className="rounded w-full"
      src={src}
      alt={alt}
    />
  );
};
