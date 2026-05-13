import Map from "./_components/Map";
import Button from "./_components/Button";
import Link from "next/link";
import CopyToClipboardButton from "./_components/CopyToClipboardButton";

type ResolvedParams = { [key: string]: string | string[] | undefined };

type PlacePageProps = {
  params: Promise<ResolvedParams>;
};

const decodeString = (value: string | string[] | undefined) =>
  decodeURIComponent(value as unknown as string)
    .replace(/\+/g, " ")
    .trim();

const getName = (resolvedParams: ResolvedParams) => {
  const { slug } = resolvedParams;

  return decodeString(slug);
};

const getCoordinates = (resolvedParams: ResolvedParams) => {
  const { latitude, longitude } = resolvedParams;

  return `${latitude}, ${longitude}`;
};

const getTitle = (resolvedParams: ResolvedParams) => {
  return getName(resolvedParams) || getCoordinates(resolvedParams);
};

const getSubtitle = (resolvedParams: ResolvedParams) => {
  return getName(resolvedParams) ? getCoordinates(resolvedParams) : "";
};

export const generateMetadata = async ({ params }: PlacePageProps) => {
  const resolvedParams = await params;

  return {
    title: getTitle(resolvedParams),
  };
};

const PlacePage = async ({ params }: PlacePageProps) => {
  const resolvedParams = await params;

  const { latitude, longitude } = resolvedParams;

  const title = getTitle(resolvedParams);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80">
        <div className="text-sm font-semibold my-4">
          <Link
            target="_blank"
            href={`https://www.google.com/search?q=${encodeURIComponent(title)}`}
          >
            {title}
          </Link>

          <div className="mt-2 text-[#9198a1]">
            <CopyToClipboardButton
              text={getCoordinates(resolvedParams).replace(/\s/g, "")}
            >
              {getSubtitle(resolvedParams)}
            </CopyToClipboardButton>
          </div>
        </div>

        <Map
          latitude={latitude as unknown as number}
          longitude={longitude as unknown as number}
        />

        <Button
          text={"apple"}
          url={`https://maps.apple.com/place?coordinate=${latitude},${longitude}`}
        />

        <Button
          text={"google"}
          url={`https://maps.google.com?q=${latitude},${longitude}`}
        />

        <Button
          text={"waze"}
          url={`https://ul.waze.com/ul?ll=${latitude},${longitude}`}
        />

        <Button
          text={"noaa"}
          url={`https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w12=fog&w13u=0&w15=lal&w16u=1&AheadHour=0&Submit=Submit&FcstType=graphical&textField1=${latitude}&textField2=${longitude}&site=all&unit=0&dd=&bw=`}
        />

        <Link target="_blank" href={"https://github.com/adrianAlday"}>
          <div className={"text-xs text-[#9198a14D]"}>built by adrian</div>
        </Link>
      </div>
    </div>
  );
};

export default PlacePage;

// to do:
// preivew image when texted
