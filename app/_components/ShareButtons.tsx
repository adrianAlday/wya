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

  const url = getUrl();
  const title = new URL(url)?.searchParams.get("t") || url;
  const date = new URL(url)?.searchParams.get("d") || url;

  return (
    <Fragment>
      {date && (
        <button
          onClick={async () => {
            window.open(
              `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}&details=${encodeURIComponent(url)}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className={buttonClasses}
        >
          <SquircleImage
            wrapperClasses={squircleButtonBackgroundClass}
            imagePath={"/google-calendar.png"}
            imageAltText={"Calendar"}
          />
        </button>
      )}

      <button
        onClick={async () => {
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
          imageClasses={"p-2"}
          imagePath={"/share.svg"}
          imageAltText={"Share"}
        />
      </button>

      <button
        onClick={async () => {
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
