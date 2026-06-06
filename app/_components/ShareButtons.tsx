"use client";

import { Fragment } from "react";
import SquircleImage from "./SquircleImage";
import { useToast } from "./ToastContext";
import { squircleButtonBackgroundClass } from "../_utils/styling";

type ShareButtonsProps = { host: string };

const ShareButtons = ({ host }: ShareButtonsProps) => {
  const getUrl = () =>
    typeof window === "undefined" ? host : window.location.href;

  const { addToast } = useToast();

  const buttonClasses = "cursor-pointer w-full";

  return (
    <Fragment>
      <button
        onClick={async () => {
          const url = getUrl();
          const title = new URL(url)?.searchParams.get("t") || url;

          try {
            await navigator.share({ url, title });
          } catch (error: unknown) {
            console.log(error);
          }
        }}
        className={buttonClasses}
      >
        <SquircleImage
          wrapperClasses={squircleButtonBackgroundClass}
          imageClasses={"p-3"}
          imagePath={"/share.svg"}
          imageAltText={"Share"}
        />
      </button>

      <button
        onClick={async () => {
          const url = getUrl();

          navigator.clipboard.writeText(url);

          addToast({ title: "Link copied", subtitle: url });
        }}
        className={buttonClasses}
      >
        <SquircleImage
          wrapperClasses={squircleButtonBackgroundClass}
          imageClasses={"p-4"}
          imagePath={"/copy.svg"}
          imageAltText="Copy"
        />
      </button>
    </Fragment>
  );
};

export default ShareButtons;
