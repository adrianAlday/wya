import FooterButton from "@/app/_components/FooterButton";
import PlaceMap from "@/app/_components/PlaceMap";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import PlaceHeader from "@/app/_components/PlaceHeader";
import { headers } from "next/headers";
import SquareButton from "@/app/_components/SquareButton";
import ShareButton from "@/app/_components/ShareButton";
import { pageMaxWidthClass } from "@/app/_utils/styling";
import CopyButton from "@/app/_components/CopyButton";

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
    <div className={`w-dvw ${pageMaxWidthClass} p-4 relative`}>
      <PlaceHeader title={title} subtitle={subtitle} />

      <PlaceMap
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
      />

      <div className="grid grid-cols-4 gap-4">
        <SquareButton
          text={"Apple"}
          imagePath={"/apple.png"}
          url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
        />

        <SquareButton
          text={"Google"}
          imagePath={"/google.png"}
          url={`https://maps.google.com?q=${latitude},${longitude}`}
        />

        <SquareButton
          text={"Waze"}
          imagePath={"/waze.png"}
          url={`https://ul.waze.com/ul?ll=${latitude},${longitude}`}
        />

        <SquareButton
          text={"Windy"}
          imagePath={"/windy.png"}
          url={`https://www.windy.com/multimodel/${latitude}/${longitude}?${latitude},${longitude},16`}
        />

        <ShareButton host={host} />

        <CopyButton host={host} />

        <SquareButton
          text={"Home"}
          imagePath={"/plus.png"}
          imageClassNames={"p-8"}
          url={`http://${host}`}
        />

        <SquareButton
          text={"Messages"}
          imagePath={"/messages.png"}
          url={`sms:${process.env.NEXT_PUBLIC_COMMENT_BOX}&body=${"wya maps, i have thoughts: ".replaceAll(" ", "%20")}`}
        />
      </div>

      <div className="flex justify-between">
        <FooterButton
          text={"Vector tiles from OpenFreeMap"}
          url={"https://openfreemap.org/quick_start"}
        />

        <FooterButton
          text={"Made with love by Adrian"}
          url={"https://github.com/adrianAlday/wya"}
        />
      </div>
    </div>
  );
};

export default PlacePage;
