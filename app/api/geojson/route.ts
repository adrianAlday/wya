import { GarminConnect } from "@flow-js/garmin-connect";
import { XMLParser } from "fast-xml-parser";
import { NextRequest, NextResponse } from "next/server";

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
    const { source, value, start, end } = await request.json();

    if (source === "garmin_course") {
      const garminClient = await new GarminConnect({
        username: process.env.GARMIN_USERNAME as string,
        password: process.env.GARMIN_PASSWORD as string,
      }).login();

      const gpx = await garminClient.exportCourseAsGpx(value);

      const lngLats = parseGpx(gpx);

      return NextResponse.json(lngLats);
    }

    if (
      ["strava_activity", "strava_route", "strava_segment"].includes(source)
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

      if (source === "strava_activity") {
        const streams = await fetch(
          `https://www.strava.com/activities/${value}/streams?stream_types[]=latlng`,
          stravaRequestOptions,
        ).then(async (response) => await response.json());

        const lngLats = streams?.latlng.map((latlng: number[]) =>
          latlng.reverse(),
        );
        const selectedLngLats = lngLats.slice(
          start || 0,
          end || lngLats.length,
        );

        return NextResponse.json(selectedLngLats);
      }

      if (source === "strava_route") {
        const gpx = await fetch(
          `https://www.strava.com/routes/${value}/export_gpx`,
          stravaRequestOptions,
        ).then(async (response) => await response.text());

        const lngLats = parseGpx(gpx);

        return NextResponse.json(lngLats);
      }

      if (source === "strava_segment") {
        const page = await fetch(
          `https://www.strava.com/segments/${value}`,
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
