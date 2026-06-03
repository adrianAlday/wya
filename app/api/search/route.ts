import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) =>
  NextResponse.json(
    await fetch("https://maps.apple.com/data/search", {
      method: "POST",
      body: JSON.stringify({
        q: request.nextUrl.searchParams.get("query"),
        sll: { lat: 0, lng: 0 },
        span: {
          latitudeDelta: 360,
          longitudeDelta: 360,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => await response.json()),
  );
