"use client";

import { Fragment, useEffect, useState } from "react";
import maplibreGl, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder, {
  MaplibreGeocoderApi,
} from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import Link from "next/link";

type TestMapProps = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const TestMap = ({ latitude, longitude, zoom }: TestMapProps) => {
  const [loading, setLoading] = useState(true);
  const [markerCoordinates, setMarkerCoordinates] = useState<
    null | [number, number]
  >(null);

  const containerId = "map";

  useEffect(() => {
    if (!document.getElementById(containerId)) {
      return;
    }

    const mapInstance = new maplibreGl.Map({
      container: containerId,
      center: [longitude, latitude],
      zoom,
      attributionControl: false,
      hash: true,
    });

    mapInstance.setStyle("https://tiles.openfreemap.org/styles/bright");

    mapInstance.dragRotate.disable();
    mapInstance.keyboard.disable();
    mapInstance.touchZoomRotate.disableRotation();

    mapInstance.setRenderWorldCopies(true);

    const geocoderApi = {
      forwardGeocode: async (config: { query: string }) => {
        const features = [];

        try {
          const geojson = await fetch(
            `https://nominatim.openstreetmap.org/search?format=geojson&polygon_geojson=1&addressdetails=1&q=${
              config.query
            }`,
          ).then(async (response) => await response.json());

          for (const feature of geojson.features) {
            const center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];

            const point = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ["place"],
              center,
            };

            features.push(point);
          }
        } catch (error) {
          console.error(`forwardGeocode Error: ${error}`);
        }

        return {
          features,
        };
      },
    } as MaplibreGeocoderApi;

    const markerSize = 36;
    const element = document.createElement("div");
    element.textContent = "📍";
    element.style.fontSize = `${markerSize}px`;
    element.style.marginTop = `-${markerSize / 2}px`;

    const geocoder = new MaplibreGeocoder(geocoderApi, {
      enableEventLogging: false,
      limit: 3,
      maplibregl: maplibreGl,
      marker: { element } as unknown as Marker,
      placeholder: "Where to?",
      proximity: { latitude, longitude },
      showResultMarkers: { element },
      showResultsWhileTyping: true,
    });

    mapInstance.addControl(geocoder, "top-left");

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
      trackUserLocation: true,
      showAccuracyCircle: true,
    });

    mapInstance.addControl(geolocateControl, "top-right");

    mapInstance.addControl(
      new NavigationControl({
        visualizePitch: false,
        visualizeRoll: false,
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );

    mapInstance.on("load", () => {
      setLoading(false);
    });

    geocoder.on("result", (event) => {
      console.log(event);

      const [lng, lat] = event.result.center as [number, number];

      setMarkerCoordinates([lat, lng]);
    });

    mapInstance.on("click", (event) => {
      console.log(event);

      new Marker({
        element,
      })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .addTo(mapInstance);

      const { lng, lat } = event.lngLat;

      setMarkerCoordinates([lat, lng]);
    });
  }, [latitude, longitude, zoom]);

  return (
    <Fragment>
      <div
        className={`${loading ? "block" : "hidden"} flex items-center justify-center h-dvh`}
      >
        <svg
          className="mr-3 -ml-1 size-5 animate-spin text-[rgb(189,190,191)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-33"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <style>
        {`
          .maplibregl-ctrl-geocoder {
            width: 280px;
          }
          .maplibregl-ctrl-geocoder--input::-webkit-search-cancel-button {
            -webkit-appearance: none;
            display: none;
          }
        `}
      </style>

      <div className={`${loading ? "hidden" : "block"} relative`}>
        <div id={containerId} className={"h-dvh"} />

        {markerCoordinates && (
          <Link href={`/${markerCoordinates[0]},${markerCoordinates[1]}`}>
            <button className="absolute bottom-4 inset-x-4 border border-[#3d444d] rounded-md bg-[#238636] py-1 flex items-center justify-center text-xs font-medium ">
              <div>{"Let's go"}</div>
            </button>
          </Link>
        )}
      </div>
    </Fragment>
  );
};

export default TestMap;
