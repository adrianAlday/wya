import FooterLink from "@/app/_components/FooterLink";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import { headers } from "next/headers";
import SquircleLink from "@/app/_components/SquircleLink";
import ShareButtons from "@/app/_components/ShareButtons";
import { placePageMaxWidthStyle } from "@/app/_utils/styling";
import { isDev } from "@/app/_utils/isDev";
import PlaceTopSection from "@/app/_components/PlaceTopSection";

const getInitialTitle = (decodedParams: Params) => {
  return (decodedParams.t || getSubtitle(decodedParams)) as string;
};
const getSubtitle = (decodedParams: Params) => {
  return `${decodedParams.latitude}, ${decodedParams.longitude}` as string;
};

const getGeoJson = async (decodedParams: Params, host: string) => {
  const { garmin_course, strava_activity, strava_route, strava_segment } =
    decodedParams;

  const body: { [key: string]: string | string[] } = {};

  if (garmin_course) {
    body.source = "garmin_course";
    body.value = garmin_course;
  }

  if (strava_activity) {
    body.source = "strava_activity";
    body.value = strava_activity;
  }

  if (strava_route) {
    body.source = "strava_route";
    body.value = strava_route;
  }

  if (strava_segment) {
    body.source = "strava_segment";
    body.value = strava_segment;
  }

  if (garmin_course || strava_activity || strava_route || strava_segment) {
    const geoJson = await fetch(`http://${host}/api/geojson`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then(async (response) => await response.json());

    return geoJson;
  }

  return null;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: PlacePageProps) => {
  const resolvedParams = { ...(await params), ...(await searchParams) };
  const decodedParams = decodeParams(resolvedParams);
  const title = getInitialTitle(decodedParams);

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
  const { latitude, longitude, m } = decodedParams;

  const initialTitle = getInitialTitle(decodedParams);
  const subtitle = getSubtitle(decodedParams);

  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host") as string;

  const geoJson = await getGeoJson(decodedParams, host);

  return (
    <div className={"w-dvw p-4 relative"} style={{ ...placePageMaxWidthStyle }}>
      <PlaceTopSection
        initialTitle={initialTitle}
        subtitle={subtitle}
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
        geoJson={geoJson}
        routeMarkerText={m}
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
          url={`http${isDev ? "" : "s"}://${host}`}
          imagePath={"/plus.svg"}
          imageAltText={"New"}
          imageClasses={"p-4"}
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
