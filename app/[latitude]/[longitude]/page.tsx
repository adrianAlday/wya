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
  const {
    garmin_course,
    strava_activity,
    strava_route,
    strava_segment,
    start,
    end,
    no_source,
  } = decodedParams;

  const body: { [key: string]: string | string[] } = {};

  if (garmin_course) {
    body.source = "garmin_course";
    body.value = garmin_course;
  }

  if (strava_activity) {
    body.source = "strava_activity";
    body.value = strava_activity;
    body.start = start as string;
    body.end = end as string;
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

    const hideSource = no_source === "";

    if (geoJson) {
      return {
        geoJson,
        geoJsonAltText: hideSource
          ? null
          : garmin_course
            ? "Garmin"
            : strava_activity || strava_route || strava_segment
              ? "Strava"
              : null,
        geoJsonUrl: hideSource
          ? null
          : garmin_course
            ? `https://connect.garmin.com/app/course/${garmin_course}`
            : strava_activity
              ? `https://www.strava.com/activities/${strava_activity}`
              : strava_route
                ? `https://www.strava.com/routes/${strava_route}`
                : strava_segment
                  ? `https://www.strava.com/segments/${strava_segment}`
                  : null,
      };
    }
  }

  return {};
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
  const host = resolvedHeaders.get("host") || "";
  const userAgent = resolvedHeaders.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);

  const { geoJson, geoJsonAltText, geoJsonUrl } = await getGeoJson(
    decodedParams,
    host,
  );

  const squircleRows = 2;
  const squircleColumns = 5;

  const generateGridTemplateStyleValue = (repeats: number) =>
    `repeat(${repeats}, minmax(0, 1fr))`;

  return (
    <div className={"w-dvw p-4 relative"} style={{ ...placePageMaxWidthStyle }}>
      <PlaceTopSection
        initialTitle={initialTitle}
        subtitle={subtitle}
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
        geoJson={geoJson}
        squircleRows={squircleRows}
        squircleColumns={squircleColumns}
      />

      <div
        className={"grid gap-4"}
        style={{
          gridTemplateRows: generateGridTemplateStyleValue(squircleRows),
          gridTemplateColumns: generateGridTemplateStyleValue(squircleColumns),
        }}
      >
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
          url={
            isMobile
              ? `uber://riderequest?dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}`
              : `https://uber.com/go?drop[0]={"latitude":${latitude},"longitude":${longitude}}`
          }
          imagePath={"/uber.jpg"}
          imageAltText={"Uber"}
        />

        {geoJson && geoJsonUrl && geoJsonAltText && (
          <SquircleLink
            url={geoJsonUrl}
            imagePath={`/${geoJsonAltText.toLowerCase()}.png`}
            imageAltText={geoJsonAltText}
          />
        )}

        <SquircleLink
          url={`https://windy.com/multimodel/${latitude}/${longitude}?${latitude},${longitude},16`}
          imagePath={"/windy.png"}
          imageAltText={"Windy"}
        />

        <ShareButtons host={host} />

        <SquircleLink
          url={`sms:${process.env.NEXT_PUBLIC_COMMENT_BOX}&body=${"wya maps, i have thoughts: ".replaceAll(" ", "%20")}`}
          imagePath={"/messages.png"}
          imageAltText={"Messages"}
        />

        <SquircleLink
          url={`http${isDev ? "" : "s"}://${host}`}
          imagePath={"/plus.svg"}
          imageAltText={"New"}
          imageClasses={"p-4"}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-x-4">
          <FooterLink
            text={"OpenFreeMap"}
            url={"https://openfreemap.org/quick_start"}
          />

          <FooterLink
            text={"Mapterhorn"}
            url={"https://mapterhorn.com/data-access/"}
          />
        </div>

        <FooterLink
          text={"Made with love by Adrian"}
          url={"https://github.com/adrianAlday/wya"}
        />
      </div>
    </div>
  );
};

export default PlacePage;
