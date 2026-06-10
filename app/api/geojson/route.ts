import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { source, value } = await request.json();

  if (source === "strava_activity") {
    try {
      const streams = await fetch(
        `https://www.strava.com/activities/${value}/streams?stream_types[]=latlng`,
        {
          method: "GET",
          headers: {
            Cookie: process.env.STRAVA_COOKIE as string,
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          },
        },
      ).then(async (response) => await response.json());

      const lngLats = streams?.latlng.map((latlng: number[]) =>
        latlng.reverse(),
      );

      return NextResponse.json(lngLats);
    } catch (error) {
      console.error(error);
    }
    return NextResponse.json(null);
  }

  return NextResponse.json(null);
};
