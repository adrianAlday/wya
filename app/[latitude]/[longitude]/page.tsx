import Button, { ButtonStyles } from "@/app/_components/Button";
import PlaceMap from "@/app/_components/PlaceMap";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import PlaceHeader from "@/app/_components/PlaceHeader";
import { headers } from "next/headers";
import ShareButton from "@/app/_components/ShareButton";

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

  return {
    title: getTitle(decodedParams),
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
    <div className="w-dvw max-w-[600px] p-4">
      <PlaceHeader
        latitude={latitude}
        longitude={longitude}
        title={title}
        subtitle={subtitle}
        host={host}
      />

      <PlaceMap
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
      />

      <Button
        text={"Apple"}
        url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Google"}
        url={`https://maps.google.com?q=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Waze"}
        url={`https://ul.waze.com/ul?ll=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Windy"}
        url={`https://www.windy.com/multimodel/${latitude}/${longitude}?${latitude},${longitude},16`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <ShareButton host={host} />

      <Button
        text={"Wya"}
        url={`http://${host}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Tiles from OpenFreeMap"}
        url={"https://openfreemap.org/quick_start"}
        buttonStyle={ButtonStyles.Tertiary}
      />

      <Button
        text={"Built by Adrian"}
        url={"https://github.com/adrianAlday"}
        buttonStyle={ButtonStyles.Tertiary}
      />
    </div>
  );
};

export default PlacePage;
