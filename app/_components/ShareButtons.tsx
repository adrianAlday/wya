"use client";

import { Fragment } from "react";
import SquircleImage from "./SquircleImage";
import { useToast } from "./ToastContext";
import { squircleButtonBackgroundClass } from "../_utils/styling";

const ShareButtons = () => {
  const url = window.location.href;
  const title = new URL(url)?.searchParams.get("t") || "";
  const date = new URL(url)?.searchParams.get("d");
  const test = new URL(url)?.searchParams.get("test");

  const { addToast } = useToast();

  const buttonClasses = "cursor-pointer w-full";

  return (
    <Fragment>
      {date && (
        <Fragment>
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

          {test && (
            <button
              onClick={() => {
                const icsContent = [
                  "BEGIN:VCALENDAR",
                  "VERSION:2.0",
                  "PRODID:-//Your Company//NextJS Calendar App//EN",
                  "BEGIN:VEVENT",
                  `URL:${window.location.href}`,
                  `DTSTART:${date}Z`,
                  // `DTEND:${endTime}`,
                  `SUMMARY:${title}`,
                  `DESCRIPTION:${url}`,
                  `LOCATION:${location}`,
                  "END:VEVENT",
                  "END:VCALENDAR",
                ].join("\r\n");

                const blob = new Blob([icsContent], {
                  type: "text/calendar;charset=utf-8;",
                });
                const icsUrl = URL.createObjectURL(blob);

                const linkElement = document.createElement("a");
                linkElement.href = icsUrl;
                linkElement.setAttribute(
                  "download",
                  `${title.replace(/\s+/g, "_")}.ics`,
                );
                document.body.appendChild(linkElement);
                linkElement.click();

                document.body.removeChild(linkElement);
                URL.revokeObjectURL(icsUrl);
              }}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Apple Calendar
            </button>
          )}
        </Fragment>
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
