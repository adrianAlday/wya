import Link from "next/link";

type FooterButtonProps = {
  url: string | object;
  text: string;
};

const FooterButton = ({ url, text }: FooterButtonProps) => {
  return (
    <Link target="_blank" href={url}>
      <div
        className={
          "mt-2.5 text-xs text-[rgb(74,74,74)] hover:text-[rgb(146,152,160)] active:text-[rgb(89,149,242)] active:underline"
        }
      >
        <div>{text}</div>
      </div>
    </Link>
  );
};

export default FooterButton;
