import Image from "next/image";

type SquircleImageProps = {
  wrapperClasses?: string;
  imageClasses?: string;
  imagePath: string;
  imageAltText: string;
};

const SquircleImage = ({
  wrapperClasses,
  imageClasses,
  imagePath,
  imageAltText,
}: SquircleImageProps) => (
  <div className={`rounded-[22.5%] aspect-square relative ${wrapperClasses}`}>
    <Image
      className={`rounded-[22.5%] ${imageClasses}`}
      src={imagePath}
      alt={imageAltText}
      fill
      style={{ objectFit: "contain" }}
      unoptimized={imagePath.includes(".svg")}
    />
  </div>
);

export default SquircleImage;
