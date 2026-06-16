import Image from "next/image";
import { squircleButtonColumns } from "../_utils/styling";

type SquircleImageProps = {
  wrapperClasses?: string;
  imageClasses?: string;
  imagePath: string;
  imageAltText: string;
  sizes?: string;
};

const SquircleImage = ({
  wrapperClasses,
  imageClasses,
  imagePath,
  imageAltText,
  sizes = `${600 / squircleButtonColumns}px`,
}: SquircleImageProps) => (
  <div className={`rounded-[22.5%] aspect-square relative ${wrapperClasses}`}>
    <Image
      className={`rounded-[22.5%] ${imageClasses}`}
      src={imagePath}
      alt={imageAltText}
      fill
      style={{ objectFit: "contain" }}
      unoptimized={imagePath.endsWith(".svg")}
      sizes={sizes}
    />
  </div>
);

export default SquircleImage;
