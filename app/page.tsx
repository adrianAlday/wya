import axios from "axios";
import { headers } from "next/headers";
import HomeMap from "./_components/HomeMap";
import { Metadata } from "next";

const DataWrapper = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await axios
    .get(`http://${host}/api/geo`)
    .then((response) => response.data)
    .catch(async (error) => {
      console.log(error);
    });

  const { latitude, longitude } = response;

  return <HomeMap latitude={latitude} longitude={longitude} zoom={5} />;
};

export const metadata: Metadata = {
  title: "wya",
};

const HomePage = async () => {
  return (
    <main>
      <DataWrapper />
    </main>
  );
};

export default HomePage;
