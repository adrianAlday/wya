"use client";

import { Fragment } from "react";
import SquircleImage from "./SquircleImage";
import { useToast } from "./ToastContext";
import { squircleButtonBackgroundClass } from "../_utils/styling";

const ShareButtons = () => {
  const url = window.location.href;
  const searchParams = new URL(url)?.searchParams;
  const title = searchParams.get("t") || "";
  const date = searchParams.get("d");
  const weekly = searchParams.get("r") === "w";

  const { addToast } = useToast();

  const buttonClasses = "cursor-pointer w-full";

  return (
    <Fragment>
      {date && (
        <button
          onClick={async () => {
            window.open(
              `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}&details=${encodeURIComponent(`${title}\n\n${url}`)}${weekly ? "&recur=RRULE:FREQ=WEEKLY;INTERVAL=1" : ""}`,
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
          imageClasses={"p-1"}
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
          imageClasses={"p-2"}
          imagePath={"/copy.svg"}
          imageAltText="Copy"
        />
      </button>
    </Fragment>
  );
};

export default ShareButtons;
