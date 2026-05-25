import React from "react";
import Button, { ButtonStyles } from "@/app/_components/Button";
import CopyToClipboardButton from "@/app/_components/CopyToClipboardButton";
import Map from "@/app/_components/Map";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { Params } from "@/app/_utils/types";
import { decodeParams } from "@/app/_utils/url";

const validateCoordinates = (query: string) => {
  const [latitude, longitude] = query.split(",").map((value) => Number(value));

  return (
    !isNaN(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    !isNaN(longitude) &&
    longitude >= -180 &&
    longitude <= 180 && [longitude, latitude]
  );
};

const searchOsm = async (
  query: string,
  retryDelay = 2,
): Promise<{ features: { geometry: { coordinates: number[] } }[] }> =>
  fetch(
    `https://nominatim.openstreetmap.org/search?format=geojson&q=${query}`,
    {
      method: "GET",
      headers: {
        "user-agent": "wya-map.vercel.app",
      },
      next: {
        revalidate: 60 * 60,
      },
    },
  )
    .then(async (response) => await response.json())
    .catch(async (error) => {
      console.log(error);

      await new Promise((resolve) => setTimeout(resolve, retryDelay * 1000));

      return await searchOsm(query, retryDelay * 2);
    });

const getTitle = (decodedParams: Params) => {
  return (decodedParams.name || decodedParams.query) as string;
};
const getSubtitle = (decodedParams: Params) => {
  return decodedParams.query as string;
};

export const generateMetadata = async ({ params }: PlacePageProps) => {
  const resolvedParams = await params;
  const decodedParams = decodeParams(resolvedParams);

  return {
    title: getTitle(decodedParams),
  };
};

type PlacePageProps = {
  params: Promise<Params>;
};
const PlacePage = async ({ params }: PlacePageProps) => {
  const resolvedParams = await params;
  const decodedParams = decodeParams(resolvedParams);
  const { query, name } = decodedParams;

  const [longitude, latitude] = validateCoordinates(query) ||
    (await searchOsm(query)).features[0]?.geometry.coordinates || [null, null];

  if (!longitude || !latitude) {
    redirect(`/?query=${query}&name=${name || ""}`, RedirectType.push);
  }

  const title = getTitle(decodedParams);
  const subtitle = getSubtitle(decodedParams);

  return (
    <React.Fragment>
      <div className="text-sm font-semibold my-4">
        <Link
          target="_blank"
          href={`https://www.google.com/search?q=${encodeURIComponent(title)}`}
        >
          {title}
        </Link>

        <div className="mt-2 text-[#9198a1]">
          <CopyToClipboardButton text={subtitle}>
            {subtitle}
          </CopyToClipboardButton>
        </div>
      </div>

      <Map
        latitude={latitude as unknown as number}
        longitude={longitude as unknown as number}
      />

      <Button
        text={"Apple"}
        url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Google"}
        url={`https://maps.google.com?q=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Waze"}
        url={`https://ul.waze.com/ul?ll=${latitude},${longitude}`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"NOAA"}
        url={`https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w12=fog&w13u=0&w15=lal&w16u=1&AheadHour=0&Submit=Submit&FcstType=graphical&textField1=${latitude}&textField2=${longitude}&site=all&unit=0&dd=&bw=`}
        buttonStyle={ButtonStyles.Secondary}
      />

      <Button
        text={"Tiles from OpenFreeMap"}
        url={"https://openfreemap.org/quick_start/"}
        buttonStyle={ButtonStyles.Tertiary}
      />

      <Button
        text={"Built by Adrian"}
        url={"https://github.com/adrianAlday"}
        buttonStyle={ButtonStyles.Tertiary}
      />
    </React.Fragment>
  );
};

export default PlacePage;
