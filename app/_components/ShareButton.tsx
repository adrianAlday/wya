"use client";

import Image from "next/image";

type ShareButtonProps = { host: string };

const ShareButton = ({ host }: ShareButtonProps) => {
  const getUrl = () =>
    typeof window === "undefined" ? host : window.location.href;

  return (
    <div>
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
        className="cursor-pointer w-full"
      >
        <div
          className={
            "rounded-[22.5%] bg-[rgb(74,74,74)] aspect-square relative"
          }
        >
          <Image
            src={"/share.png"}
            alt={"Share"}
            fill
            style={{ objectFit: "contain" }}
            className={"rounded-[22.5%] p-4"}
          />
        </div>
      </button>
    </div>
  );
};

export default ShareButton;
