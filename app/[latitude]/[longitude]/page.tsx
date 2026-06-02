import Button, { ButtonStyles } from "@/app/_components/Button";
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

function getTileNumbers(latitude: number, longitude: number, zoom: number) {
  const sideTiles = Math.pow(2, zoom);
  const latitudeRadians = (latitude * Math.PI) / 180;

  const x = Math.floor(((longitude + 180) / 360) * sideTiles);

  const y = Math.floor(
    ((1 -
      Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) /
        Math.PI) /
      2) *
      sideTiles,
  );

  const z = zoom;

  return { x, y, z };
}

export const generateMetadata = async ({
  params,
  searchParams,
}: PlacePageProps) => {
  const resolvedParams = { ...(await params), ...(await searchParams) };
  const decodedParams = decodeParams(resolvedParams);

  const title = getTitle(decodedParams);

  const { latitude, longitude } = decodedParams;
  const { x, y, z } = getTileNumbers(Number(latitude), Number(longitude), 15);

  return {
    title,
    openGraph: {
      title,
      description: title,
      images: [
        {
          url: `http://tile.openstreetmap.org/${z}/${x}/${y}.png`,
          width: 630,
          height: 630,
        },
      ],
    },
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
          imagePath={"/search.png"}
          url={`http://${host}`}
        />
      </div>

      <div className="flex justify-between">
        <Button
          text={"Tiles from OpenFreeMap"}
          url={"https://openfreemap.org/quick_start"}
          buttonStyle={ButtonStyles.Tertiary}
        />

        <Button
          text={"Made with love by Adrian"}
          url={"https://github.com/adrianAlday/wya"}
          buttonStyle={ButtonStyles.Tertiary}
        />
      </div>
    </div>
  );
};

export default PlacePage;
