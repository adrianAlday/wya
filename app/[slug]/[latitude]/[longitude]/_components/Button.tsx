import Link from "next/link";

export enum ButtonStyles {
  Dark = "dark",
}

type ButtonProps = {
  text: string;
  url: string;
  buttonStyle?: string;
};

const Button = ({ url, text, buttonStyle }: ButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={`my-4 text-xs ${
          buttonStyle === ButtonStyles.Dark
            ? "text-[#9198a14D]"
            : "border border-[#3d444d] rounded-md bg-[#212830] py-1 flex items-center justify-center font-medium"
        }`}
      >
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default Button;
