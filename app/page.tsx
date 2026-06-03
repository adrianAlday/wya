import { headers } from "next/headers";
import HomeMap from "./_components/HomeMap";
import { Metadata } from "next";

const DataWrapper = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await fetch(`http://${host}/api/geo`)
    .then(async (response) => await response.json())
    .catch((error) => {
      console.error(`Geocode Error: ${error}`);
    });

  const { latitude, longitude } = response;

  return <HomeMap latitude={latitude} longitude={longitude} geoZoom={5} />;
};

export const metadata: Metadata = {
  title: "wya maps",
};

const HomePage = async () => (
  <main>
    <DataWrapper />
  </main>
);

export default HomePage;
