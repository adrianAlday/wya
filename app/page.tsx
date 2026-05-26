import { Params } from "./_utils/types";
import HomePageForm from "./_components/HomePageForm";

type HomePageProps = {
  searchParams: Promise<Params>;
};

const HomePage = async ({ searchParams }: HomePageProps) => {
  const resolvedSearchParams = await searchParams;

  return <HomePageForm resolvedSearchParams={resolvedSearchParams} />;
};

export default HomePage;

// to do:
// bad query message
// put street address into map links
// opengraph preview image
// recenter button
// add classnames library
// copy link button
// handle multiple locations, use query string
// rename repo to wya-maps?
// https://maplibre.org/maplibre-gl-js/docs/examples/measure-distances/
