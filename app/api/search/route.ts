import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { query, latitude, longitude } = await request.json();

  const search = await fetch("https://maps.apple.com/data/search", {
    method: "POST",
    body: JSON.stringify({
      q: query,
      sll: { lat: latitude, lng: longitude },
      span: {
        latitudeDelta: 180,
        longitudeDelta: 360,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => await response.json());

  return NextResponse.json(search);
};
