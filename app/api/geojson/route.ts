import { GarminConnect } from "@flow-js/garmin-connect";
import { XMLParser } from "fast-xml-parser";
import { NextRequest, NextResponse } from "next/server";

export enum RouteType {
  GarminCourse = "garminCourse",
  StravaActivity = "stravaActivity",
  StravaRoute = "stravaRoute",
  StravaSegment = "stravaSegment",
}

const parseGpx = (gpx: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const json = parser.parse(gpx);

  return json.gpx.trk.trkseg.trkpt.map((point: { [key: string]: string }) => [
    point.lon,
    point.lat,
  ]);
};

const parsePage = (page: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const json = parser.parse(page);

  return JSON.parse(
    json.html.body.script["#text"],
  ).props.pageProps.streams.location.map((latlng: number[]) =>
    latlng.reverse(),
  );
};

export const POST = async (request: NextRequest) => {
  try {
    const { type, id, start, end } = await request.json();

    if (type === RouteType.GarminCourse) {
      const garminClient = await new GarminConnect({
        username: process.env.GARMIN_USERNAME as string,
        password: process.env.GARMIN_PASSWORD as string,
      }).login();

      const gpx = await garminClient.exportCourseAsGpx(id);

      const lngLats = parseGpx(gpx);

      return NextResponse.json(lngLats);
    }

    if (
      [
        RouteType.StravaActivity,
        RouteType.StravaRoute,
        RouteType.StravaSegment,
      ].includes(type)
    ) {
      const stravaRequestOptions = {
        method: "GET",
        headers: {
          Cookie: (process.env.STRAVA_COOKIE as string).replace(
            /^['"]+|\*+['"]+$/g,
            "",
          ),
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },
      };

      if (type === RouteType.StravaActivity) {
        const streams = await fetch(
          `https://www.strava.com/activities/${id}/streams?stream_types[]=latlng`,
          stravaRequestOptions,
        ).then(async (response) => await response.json());

        const lngLats = streams?.latlng.map((latlng: number[]) =>
          latlng.reverse(),
        );
        const selectedLngLats = lngLats.slice(
          !start || start === "inf" ? 0 : start,
          !end || end === "inf" ? lngLats.length : end,
        );

        return NextResponse.json(selectedLngLats);
      }

      if (type === RouteType.StravaRoute) {
        const gpx = await fetch(
          `https://www.strava.com/routes/${id}/export_gpx`,
          stravaRequestOptions,
        ).then(async (response) => await response.text());

        const lngLats = parseGpx(gpx);

        return NextResponse.json(lngLats);
      }

      if (type === RouteType.StravaSegment) {
        const page = await fetch(
          `https://www.strava.com/segments/${id}`,
          stravaRequestOptions,
        ).then(async (response) => await response.text());

        const lngLats = parsePage(page);

        return NextResponse.json(lngLats);
      }
    }

    throw new Error("Invalid source");
  } catch (error) {
    console.error(error);

    return NextResponse.json(null);
  }
};
