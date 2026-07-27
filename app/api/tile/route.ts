import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { z, x, y } = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    const imageResponse = await fetch(
      `http://tile.openstreetmap.org/${z}/${x}/${y}.png`,
      {
        headers: {
          "User-Agent": "wya/1.0 (https://wya-maps.vercel.app)",
        },
      },
    );

    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch remote image", {
        status: imageResponse.status,
      });
    }

    return new NextResponse(imageResponse.body, {
      status: 200,
      headers: {
        "Content-Type":
          imageResponse.headers.get("Content-Type") || "image/jpeg",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
