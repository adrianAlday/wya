import FooterLink from "@/app/_components/FooterLink";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import { headers } from "next/headers";
import SquircleLink from "@/app/_components/SquircleLink";
import {
  placePageMaxWidthStyle,
  squircleButtonColumns,
  squircleButtonGap,
  squircleButtonRows,
} from "@/app/_utils/styling";
import { isDev } from "@/app/_utils/isDev";
import PlaceTopSection from "@/app/_components/PlaceTopSection";
import DynamicShareButtons from "@/app/_components/DynamicShareButtons";
import { RouteType } from "@/app/api/geojson/route";

const getInitialTitle = (decodedParams: Params) => {
  return (decodedParams.t || getSubtitle(decodedParams)) as string;
};
const getSubtitle = (decodedParams: Params) => {
  return `${decodedParams.latitude}, ${decodedParams.longitude}` as string;
};

const getGeoJson = async (decodedParams: Params, host: string) => {
  const { r } = decodedParams;

  if (r) {
    const [showPart, sourcePart, typePart, idPart, startPart, endPart] = (
      r as string
    ).split("-");

    enum RouteSource {
      Garmin = "garmin",
      Strava = "strava",
    }

    const RouteSourceMap = {
      ga: RouteSource.Garmin,
      st: RouteSource.Strava,
    } as { [key: string]: RouteSource };

    const source = RouteSourceMap[sourcePart];

    if (source) {
      const RouteTypeMap = {
        [RouteSource.Garmin]: {
          co: RouteType.GarminCourse,
        },
        [RouteSource.Strava]: {
          ac: RouteType.StravaActivity,
          ro: RouteType.StravaRoute,
          se: RouteType.StravaSegment,
        },
      } as {
        [key: string]: {
          [key: string]: RouteType;
        };
      };

      const type = RouteTypeMap[source]?.[typePart];

      if (type) {
        const body: { [key: string]: string | string[] } = {};

        body.type = type;
        body.id = idPart;
        body.start = startPart;
        body.end = endPart;

        const geoJson = await fetch(`http://${host}/api/geojson`, {
          method: "POST",
          body: JSON.stringify(body),
        }).then(async (response) => await response.json());

        if (geoJson) {
          const showSource = showPart === "1";

          return {
            geoJson,
            geoJsonAltText: !showSource ? null : source,
            geoJsonUrl: !showSource
              ? null
              : source === RouteSource.Garmin && type
                ? type === RouteType.GarminCourse
                  ? `https://connect.garmin.com/app/course/${idPart}`
                  : null
                : source == RouteSource.Strava && type
                  ? `https://www.strava.com/${type === RouteType.StravaActivity ? "activities" : type === RouteType.StravaRoute ? "routes" : type === RouteType.StravaSegment ? "segments" : null}/${idPart}`
                  : null,
          };
        }
      }
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
  const { latitude, longitude } = decodedParams;

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
      />

      <div
        className={"grid"}
        style={{
          gridTemplateRows: generateGridTemplateStyleValue(squircleButtonRows),
          gridTemplateColumns: generateGridTemplateStyleValue(
            squircleButtonColumns,
          ),
          gap: squircleButtonGap,
        }}
      >
        <SquircleLink
          url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
          imagePath={"/apple.png"}
          imageAltText={"Apple"}
        />

        <SquircleLink
          url={`https://maps.google.com?q=${latitude},${longitude}`}
          imagePath={"/google-maps.png"}
          imageAltText={"Google Maps"}
        />

        <SquircleLink
          url={
            isMobile
              ? `transit://directions?to=${latitude},${longitude}`
              : `https://transitapp.com/en/trip?destination=${latitude},${longitude}`
          }
          imagePath={"/transit.png"}
          imageAltText={"Transit"}
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
          imagePath={"/uber.png"}
          imageAltText={"Uber"}
        />

        <SquircleLink
          url={
            isMobile
              ? `lyft://ridetype?destination[latitude]=${latitude}&destination[longitude]=${longitude}`
              : `https://ride.lyft.com`
          }
          imagePath={"/lyft.png"}
          imageAltText={"Lyft"}
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
        <SquircleLink
          url={`https://waqi.info/#/c/${latitude}/${longitude}/10z`}
          imagePath={"/waqi.png"}
          imageAltText={"Waqi"}
        />

        <DynamicShareButtons />

        <SquircleLink
          url={`sms:${process.env.NEXT_PUBLIC_COMMENT_BOX}&body=${"wya maps, i have thoughts: ".replaceAll(" ", "%20")}`}
          imagePath={"/messages.png"}
          imageAltText={"Messages"}
        />

        <SquircleLink
          url={`http${isDev ? "" : "s"}://${host}`}
          imagePath={"/plus.svg"}
          imageAltText={"New"}
          imageClasses={"p-[15%]"}
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
          text={"Made in Baltimore"}
          url={"https://github.com/adrianAlday/wya"}
        />
      </div>
    </div>
  );
};

export default PlacePage;
