import FooterLink from "@/app/_components/FooterLink";
import PlaceMap from "@/app/_components/PlaceMap";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import PlaceHeader from "@/app/_components/PlaceHeader";
import { headers } from "next/headers";
import SquircleLink from "@/app/_components/SquircleLink";
import ShareButtons from "@/app/_components/ShareButtons";
import { placePageMaxWidthStyle } from "@/app/_utils/styling";

const getTitle = (decodedParams: Params) => {
  return (decodedParams.t ||
    `${decodedParams.latitude}, ${decodedParams.longitude}`) as string;
};
const getSubtitle = (decodedParams: Params) => {
  return `${decodedParams.latitude}, ${decodedParams.longitude}` as string;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: PlacePageProps) => {
  const resolvedParams = { ...(await params), ...(await searchParams) };
  const decodedParams = decodeParams(resolvedParams);
  const title = getTitle(decodedParams);

  return {
    title,
  };
};

type PlacePageProps = {
  params: Promise<Params>;
  searchParams: Promise<Params>;
};

const PlacePage = async ({ params, searchParams }: PlacePageProps) => {
  const resolvedParams = { ...(await params), ...(await searchParams) };
  const decodedParams = decodeParams(resolvedParams);
  const { latitude, longitude } = decodedParams;

  const title = getTitle(decodedParams);
  const subtitle = getSubtitle(decodedParams);

  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host") as string;

  return (
    <div className={"w-dvw p-4 relative"} style={{ ...placePageMaxWidthStyle }}>
      <PlaceHeader title={title} subtitle={subtitle} />

      <PlaceMap
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
      />

      <div className="grid grid-cols-4 gap-4">
        <SquircleLink
          url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
          imagePath={"/apple.png"}
          imageAltText={"Apple"}
        />

        <SquircleLink
          url={`https://maps.google.com?q=${latitude},${longitude}`}
          imagePath={"/google.png"}
          imageAltText={"Google"}
        />

        <SquircleLink
          url={`https://ul.waze.com/ul?ll=${latitude},${longitude}`}
          imagePath={"/waze.png"}
          imageAltText={"Waze"}
        />

        <SquircleLink
          url={`https://www.windy.com/multimodel/${latitude}/${longitude}?${latitude},${longitude},16`}
          imagePath={"/windy.png"}
          imageAltText={"Windy"}
        />

        <ShareButtons host={host} />

        <SquircleLink
          url={`http://${host}`}
          imagePath={"/plus.png"}
          imageAltText={"Home"}
          imageClasses={"p-8"}
        />

        <SquircleLink
          url={`sms:${process.env.NEXT_PUBLIC_COMMENT_BOX}&body=${"wya maps, i have thoughts: ".replaceAll(" ", "%20")}`}
          imagePath={"/messages.png"}
          imageAltText={"Messages"}
        />
      </div>

      <div className="flex justify-between">
        <FooterLink
          text={"Vector tiles from OpenFreeMap"}
          url={"https://openfreemap.org/quick_start"}
        />

        <FooterLink
          text={"Made with love by Adrian"}
          url={"https://github.com/adrianAlday/wya"}
        />
      </div>
    </div>
  );
};

export default PlacePage;
