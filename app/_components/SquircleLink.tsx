import Link from "next/link";
import SquircleImage from "./SquircleImage";
import { squircleButtonBackgroundClass } from "../_utils/styling";

type SquircleLinkProps = {
  classNames?: string;
  url: string | object;
  imageClasses?: string;
  imagePath: string;
  imageAltText: string;
};

const SquircleLink = ({
  classNames,
  url,
  imageClasses,
  imagePath,
  imageAltText,
}: SquircleLinkProps) => (
  <Link target="_blank" href={url} className={classNames}>
    <SquircleImage
      wrapperClasses={`border-[0.5px] border-[rgba(61,68,77,0.1)] ${squircleButtonBackgroundClass}`}
      imageClasses={imageClasses}
      imagePath={imagePath}
      imageAltText={imageAltText}
    />
  </Link>
);

export default SquircleLink;
