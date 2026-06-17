"use client";

import dynamic from "next/dynamic";

const DynamicShareButtons = dynamic(
  () => import("@/app/_components/ShareButtons"),
  { ssr: false },
);

export default DynamicShareButtons;
