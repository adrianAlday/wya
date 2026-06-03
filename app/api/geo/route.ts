import { isDev } from "@/app/_utils/isDev";
import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const details = isDev
    ? {
        city: "Alexandria",
        country: "US",
        flag: "🇺🇸",
        countryRegion: "VA",
        region: "iad1",
        latitude: "38.8423",
        longitude: "-77.0593",
        postalCode: "22305",
      }
    : geolocation(request);

  return NextResponse.json(details);
};
