import { headers } from "next/headers";
import SandboxMap from "../_components/SandboxMap";

const DataWrapper = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await fetch(`http://${host}/api/geolocate`)
    .then(async (response) => await response.json())
    .catch((error) => {
      console.error(`Geocode Error: ${error}`);
    });

  console.log(response);

  const { latitude, longitude } = response;

  return (
    <div>
      <SandboxMap latitude={latitude} longitude={longitude} zoom={0} />
    </div>
  );
};

const SandboxPage = async () => (
  <main>
    <DataWrapper />
  </main>
);

export default SandboxPage;
