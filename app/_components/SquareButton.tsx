import Image from "next/image";
import Link from "next/link";

type SquareButtonProps = {
  url: string | object;
  text: string;
  imagePath?: string;
  imageClassNames?: string;
};

const SquareButton = ({
  url,
  text,
  imagePath,
  imageClassNames,
}: SquareButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={`text-base border border-[#3d444d] rounded-[22.5%] ${"bg-[#212830] hover:bg-[rgb(39,44,53)] active:bg-[rgb(42,49,59)]"} aspect-square transition-colors py-1 flex items-center justify-center font-medium relative`}
      >
        {imagePath ? (
          <Image
            src={imagePath}
            alt={text}
            fill
            className={`rounded-[22.5%] ${imageClassNames}`}
          />
        ) : (
          <div className="text-center">{text}</div>
        )}
      </div>
    </Link>
  );
};

export default SquareButton;
