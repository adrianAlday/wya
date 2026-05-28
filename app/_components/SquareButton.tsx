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
        className={"rounded-[22.5%] bg-[rgb(74,74,74)] aspect-square relative"}
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
