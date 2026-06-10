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

export const POST = async (request: NextRequest) => {
  try {
    const { source, value } = await request.json();

    if (source === "garmin_course") {
      const gpx = await fetch(
        `https://connect.garmin.com/gc-api/course-service/course/gpx/${value}`,
        {
          method: "GET",
          headers: {
            Cookie: process.env.GARMIN_COOKIE as string,
            "connect-csrf-token": process.env.GARMIN_TOKEN as string,
            "sec-fetch-site": "same-origin",
          },
        },
      ).then(async (response) => await response.text());

      const lngLats = parseGpx(gpx);

      return NextResponse.json(lngLats);
    }

    if (["strava_activity", "strava_route"].includes(source)) {
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

        console.log(streams);

        const lngLats = streams?.latlng.map((latlng: number[]) =>
          latlng.reverse(),
        );

        return NextResponse.json(lngLats);
      }

      if (source === "strava_route") {
        const gpx = await fetch(
          `https://www.strava.com/routes/${value}/export_gpx`,
          stravaRequestOptions,
        ).then(async (response) => await response.text());

        console.log(gpx);

        const lngLats = parseGpx(gpx);

        return NextResponse.json(lngLats);
      }
    }

    throw new Error("Invalid source");
  } catch (error) {
    console.error(error);

    return NextResponse.json(null);
  }
};
