import { headers } from "next/headers";
import HomeMap from "./_components/HomeMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "wya Maps",
};

const HomePage = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const response = await fetch(`http://${host}/api/geoip`)
    .then(async (response) => await response.json())
    .catch((error) => {
      console.error(`Geocode Error: ${error}`);
    });

  const { latitude, longitude } = response;

  return (
    <main>
      <HomeMap latitude={latitude} longitude={longitude} />
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
// clear button for pin search
// make place pin draggable when new?
// add title to link out queries to like google?
// allow toasts with diff icons?
// fix title saved toast fires when sharing
// edit title button?
// apple maps auto complete?
// go button still too low on pwa
// pwa manifest
// reverse geocode and get hours from apple maps?
// share preview image, try setting only url? on prod?
// pulse input border when new?
// allow strict mode
// home map, spacing controls 16px from edge?
// make search marker draggable?
// show return key on keyboard?
// make append return key button
// make text color red when editing and over x characters
// allow adding garmin_route
// get strava acivity via gpx?
// animate line once
// is logging in on garmin every call too much? is this cached?
