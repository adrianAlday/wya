import Link from "next/link";
import SquircleImage from "./SquircleImage";
import {
  borderClasses,
  squircleButtonBackgroundClass,
} from "../_utils/styling";

type SquircleLinkProps = {
  url: string | object;
  imageClasses?: string;
  imagePath: string;
  imageAltText: string;
};

const SquircleLink = ({
  url,
  imageClasses,
  imagePath,
  imageAltText,
}: SquircleLinkProps) => (
  <Link target="_blank" href={url}>
    <SquircleImage
      wrapperClasses={`border-[0.5px] border-[rgba(61,68,77,0.1)] ${squircleButtonBackgroundClass}`}
      imageClasses={imageClasses}
      imagePath={imagePath}
      imageAltText={imageAltText}
    />
  </Link>
);

export default SquircleLink;
