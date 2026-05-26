import axios from "axios";
import { headers } from "next/headers";
import SandboxMap from "../_components/SandboxMap";

const DataWrapper = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await axios
    .get(`http://${host}/api/geo`)
    .then((response) => response.data)
    .catch(async (error) => {
      console.log(error);
    });

  console.log(response);

  const { latitude, longitude } = response;

  return (
    <div>
      <SandboxMap latitude={latitude} longitude={longitude} zoom={7} />
    </div>
  );
};

const SandboxPage = async () => {
  return (
    <main>
      <DataWrapper />
    </main>
  );
};

export default SandboxPage;
