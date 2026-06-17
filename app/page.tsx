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
// get strava acivity via gpx?
// is logging in on garmin every call too much? is this cached?
// disable console in prod?
// compiler: {
//   removeConsole: process.env.NODE_ENV === "production",
// },
// use strava api?
// allow adding another arbitrary marker
// get activity from intervals.icu?
// strava or garmin button to open the route
// strava route get from page instead of gpx?
// show hide bottom buttons
// less bold line around input?
// contour lines https://mapterhorn.com/examples/contour/
// bigger mile marker shadow?
// another line layer as route shadow?
// allow subset of route data for all data types
// one line selectedlnglats?
// initial zoom with route not correct?
// color of place map zoom and geolocaet controls
// map fullscreen button
// light trace with transparent background on top of elevation line?
// marker logic correct? kinda clocks a little every loop
// marker show hide with feature state?
// place spinner is high?
// font fetch failing? GET https://tiles.openfreemap.org/fonts/-apple-system,BlinkMacSystemFont,sans-serif/0-255.pbf 404 (Not Found)
// uber affiliate link?
// if is dev, click logs latlong
// just pass button height?
// go back down to 5 columns if no strava? prop drill again
// shorten strava param name?
// track tap popsup says distance and elevation
// home map slow load
