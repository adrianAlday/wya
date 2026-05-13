import Link from "next/link";

type ButtonProps = {
  text: string;
  url: string;
};

const Button = ({ url, text }: ButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div className="my-4 border border-[#3d444d] rounded-md bg-[#212830] py-1 flex items-center justify-center text-xs font-medium">
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default Button;
