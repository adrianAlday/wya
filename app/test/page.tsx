import axios from "axios";
import { headers } from "next/headers";
import TestMap from "../_components/TestMap";

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

  return <TestMap latitude={latitude} longitude={longitude} zoom={5} />;
};

const TestPage = async () => {
  return (
    <main>
      <DataWrapper />
    </main>
  );
};

export default TestPage;
