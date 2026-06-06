import Link from "next/link";

type FooterLinkProps = {
  url: string | object;
  text: string;
};

const FooterLink = ({ url, text }: FooterLinkProps) => (
  <Link
    target="_blank"
    href={url}
    className={
      "mt-2.5 text-xs text-[rgb(74,74,74)] hover:text-[rgb(146,152,160)] active:text-[rgb(89,149,242)] active:underline"
    }
  >
    {text}
  </Link>
);

export default FooterLink;
