import { XMLParser } from "fast-xml-parser";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { source, value } = await request.json();

    if (["strava_activity", "strava_route"].includes(source)) {
      const stravaRequestOptions = {
        method: "GET",
        headers: {
          Cookie: process.env.STRAVA_COOKIE as string,
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

        return NextResponse.json(lngLats);
      }

      if (source === "strava_route") {
        const xml = await fetch(
          `https://www.strava.com/routes/${value}/export_gpx`,
          stravaRequestOptions,
        ).then(async (response) => await response.text());

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const json = parser.parse(xml);

        const lngLats = json.gpx.trk.trkseg.trkpt.map(
          (point: { [key: string]: string }) => [point.lon, point.lat],
        );

        return NextResponse.json(lngLats);
      }
    }

    throw new Error("Invalid source");
  } catch (error) {
    console.error(error);

    return NextResponse.json(null);
  }
};
