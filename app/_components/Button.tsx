import Link from "next/link";

export enum ButtonStyles {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "teriary",
}

type ButtonProps = {
  url: string | object;
  text: string;
  buttonStyle: string;
};

const Button = ({ url, text, buttonStyle }: ButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={`my-4 text-xs ${
          buttonStyle === ButtonStyles.Tertiary
            ? "text-[#9198a14D]"
            : `border border-[#3d444d] rounded-md ${
                buttonStyle === ButtonStyles.Primary
                  ? "bg-[#238636]"
                  : "bg-[#212830]"
              } transition-colors py-1 flex items-center justify-center font-medium`
        }`}
      >
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default Button;
