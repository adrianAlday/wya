import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - wya Maps",
};

const AboutPage = () => {
  return (
    <div className="my-8 flex flex-col gap-4 text-xs">
      <Link target="_blank" href={"/"}>
        <div className="text-sm font-semibold">📍 wya Maps</div>
      </Link>

      <div>Next.js with Vercel</div>

      <div>Apple Maps and OpenStreetMap Nominatim APIs</div>

      <div>MapLibre library with plugins</div>

      <div>OpenFreeMap vector tiles</div>

      <Link target="_blank" href={"https://github.com/adrianAlday/wya"}>
        <div className="underline">Repo</div>
      </Link>
    </div>
  );
};

export default AboutPage;
