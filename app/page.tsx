import { headers } from "next/headers";
import HomeMap from "./_components/HomeMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "wya maps",
};

const HomePage = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await fetch(`http://${host}/api/geolocate`)
    .then(async (response) => await response.json())
    .catch((error) => {
      console.error(`Geocode Error: ${error}`);
    });

  const { latitude, longitude } = response;

  return (
    <main>
      <HomeMap latitude={latitude} longitude={longitude} geoZoom={5} />;
    </main>
  );
};

export default HomePage;

// to do:
// add classnames library
// handle multiple locations, use query string
// rename repo to wya-maps?
// search suggestions with numbered results and markers ?
// more info for picker map
// different languagers lets go
// [
//   "Let's go",
//   "Vamos",
//   "Allez",
//   "Andiamo",
//   "Auf geht's",
//   "Ikimashou",
//   "Gaja",
//   "Zǒuba",
// ];
// real modal for title
// use apple clear icon?
// clear button for pin search
// make place pin draggable when new?
// add title to link out queries to like google?
// add apple icon
// allow toasts with diff icons?
// fix title saved toast fires when sharing
// edit title button?
// apple maps auto complete?
// go button still too low on pwa
// pwa manifest
// get apple symbols
// change svgs on line meassure thing
// reverse geocode and get hours from apple maps?
// cleanup components
// rename to route to geoip
// loader at top instead of centered
// toasts on right edge if full width
// about page
