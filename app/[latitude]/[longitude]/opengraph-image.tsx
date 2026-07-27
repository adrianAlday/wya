import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";
import { headers } from "next/headers";
import { ImageResponse } from "next/og";

export const contentType = "image/png";

export const alt = "map";

const imageSize = 256;
const pinSize = imageSize / 10;

export const size = {
  width: imageSize,
  height: imageSize,
};

const getTileCoordinates = (
  latitude: number,
  longitude: number,
  zoom: number,
) => {
  const sideTiles = Math.pow(2, zoom);
  const latitudeRadians = (latitude * Math.PI) / 180;

  const rawX = ((longitude + 180) / 360) * sideTiles;
  const x = Math.floor(rawX);

  const rawY =
    ((1 -
      Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) /
        Math.PI) /
      2) *
    sideTiles;
  const y = Math.floor(rawY);

  const z = zoom;

  return { rawX, x, rawY, y, z };
};

type ImageProps = {
  params: Promise<Params>;
  searchParams: Promise<Params>;
};

const Image = async ({ params, searchParams }: ImageProps) => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const resolvedParams = { ...(await params), ...(await searchParams) };
  const decodedParams = decodeParams(resolvedParams);
  const { latitude, longitude } = decodedParams;
  const { rawX, x, rawY, y, z } = getTileCoordinates(
    Number(latitude),
    Number(longitude),
    15,
  );
  const xRemainder = rawX % 1;
  const yRemainder = rawY % 1;
  const [x1, x2, xOffset] =
    xRemainder < 0.5
      ? [x - 1, x, (xRemainder + 0.5) * imageSize]
      : [x, x + 1, (xRemainder - 0.5) * imageSize];
  const [y1, y2, yOffset] =
    yRemainder < 0.5
      ? [y - 1, y, (yRemainder + 0.5) * imageSize]
      : [y, y + 1, (yRemainder - 0.5) * imageSize];

  const tileEndpoint = `http://${host}/api/tile`;

  return new ImageResponse(
    <div
      style={{
        ...size,
        position: "relative",
        display: "flex",
      }}
    >
      <img
        style={{
          ...size,
          position: "absolute",
          left: 0 - xOffset,
          top: 0 - yOffset,
        }}
        src={`${tileEndpoint}?z=${z}&x=${x1}&y=${y1}`}
        alt="map"
      />

      <img
        style={{
          ...size,
          position: "absolute",
          left: 0 - xOffset,
          top: imageSize - yOffset,
        }}
        src={`${tileEndpoint}?z=${z}&x=${x1}&y=${y2}`}
        alt="map"
      />

      <img
        style={{
          ...size,
          position: "absolute",
          left: imageSize - xOffset,
          top: 0 - yOffset,
        }}
        src={`${tileEndpoint}?z=${z}&x=${x2}&y=${y1}`}
        alt="map"
      />

      <img
        style={{
          ...size,
          position: "absolute",
          left: imageSize - xOffset,
          top: imageSize - yOffset,
        }}
        src={`${tileEndpoint}?z=${z}&x=${x2}&y=${y2}`}
        alt="map"
      />

      <img
        style={{
          width: pinSize,
          height: pinSize,
          position: "absolute",
          left: imageSize / 2 - pinSize / 2,
          top: imageSize / 2 - pinSize,
        }}
        src={`http://${host}/pin.png`}
        alt="pin"
      />
    </div>,
    {
      ...size,
    },
  );
};

export default Image;
