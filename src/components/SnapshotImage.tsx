import Image from "next/image";

export const SnapshotImage = ({ src, alt }: { src: string; alt: string }) => {
  if (!src) {
    return <div className="w-[282] h-[159]"></div>;
  }
  return (
    <Image
      width={282}
      height={159}
      className="rounded max-w-full"
      src={src}
      alt={alt}
    />
  );
};
