"use client";

import Image from "next/image";
import { useToast } from "./ToastContext";

type CopyButtonProps = { host: string };

const CopyButton = ({ host }: CopyButtonProps) => {
  const getUrl = () =>
    typeof window === "undefined" ? host : window.location.href;

  const { addToast } = useToast();

  return (
    <div>
      <button
        onClick={async () => {
          const url = getUrl();

          navigator.clipboard.writeText(url);

          addToast({ title: "Link copied", subtitle: url });
        }}
        className="cursor-pointer w-full"
      >
        <div
          className={
            "rounded-[22.5%] bg-[rgb(74,74,74)] aspect-square relative"
          }
        >
          <Image
            src={"/copy.png"}
            alt={"Copy"}
            fill
            style={{ objectFit: "contain" }}
            className={"rounded-[22.5%] p-6"}
          />
        </div>
      </button>
    </div>
  );
};

export default CopyButton;
