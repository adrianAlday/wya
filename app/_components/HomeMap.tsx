"use client";

import { useEffect, useState } from "react";
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
import { zoom, speed, essential } from "../_utils/map";

type HomeMapProps = {
  latitude: number;
  longitude: number;
  geoZoom: number;
};

export const paramForNewPlace = "n";

const HomeMap = ({ latitude, longitude, geoZoom }: HomeMapProps) => {
  const [loading, setLoading] = useState(true);

  const initialMarkerCoordinates = null;

  const [markerCoordinates, setMarkerCoordinates] = useState<
    null | [number, number]
  >(initialMarkerCoordinates);

  const [hasGeolocated, setHasGeolocated] = useState(false);

  const mapContainerId = "map";

  const goButtonId = "go";

  const emptyButton = "empty";

  useEffect(() => {
    const getById = (id: string) => document.getElementById(id) as HTMLElement;

    if (!getById(mapContainerId) || hasGeolocated) {
      return;
    }

    const mapInstance = new maplibreGl.Map({
      container: mapContainerId,
      center: [longitude, latitude],
      zoom: geoZoom,
      attributionControl: false,
    });

    mapInstance.setStyle("https://tiles.openfreemap.org/styles/bright");

    mapInstance.dragRotate.disable();
    mapInstance.touchZoomRotate.disableRotation();
    mapInstance.keyboard.disable();

    mapInstance.setMaxPitch(0);
    mapInstance.touchPitch.disable();

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
      debounceSearch: 400,
      flyTo: { speed, essential },
      limit: 3,
      maplibregl: maplibreGl,
      marker: { element } as unknown as Marker,
      placeholder: "Where to?",
      showResultMarkers: { element },
      showResultsWhileTyping: true,
      zoom,
    });

    mapInstance.addControl(geocoder, "top-left");

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
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

    const marker = new Marker({
      element,
    });

    mapInstance.on("load", () => {
      setLoading(false);

      geolocateControl.trigger();
    });

    geocoder.on("loading", () => {
      marker.remove();

      getById(emptyButton).focus();

      setMarkerCoordinates(initialMarkerCoordinates);
    });

    geocoder.on("result", (event) => {
      const [lng, lat] = event.result.center as [number, number];

      setMarkerCoordinates([lat, lng]);
    });

    geolocateControl.on("geolocate", (event) => {
      if (!hasGeolocated) {
        setHasGeolocated(true);

        const { latitude, longitude } = event.coords;

        marker.setLngLat([longitude, latitude]).addTo(mapInstance);

        setMarkerCoordinates([latitude, longitude]);
      }
    });

    mapInstance.on("click", (event) => {
      const { lng, lat } = event.lngLat;

      geocoder.clear();

      getById(emptyButton).focus();

      marker.setLngLat([lng, lat]).addTo(mapInstance);

      mapInstance.flyTo({
        center: event.lngLat,
        speed,
        essential,
        ...(mapInstance.getZoom() < zoom ? { zoom } : {}),
      });

      setMarkerCoordinates([lat, lng]);
    });
  }, [latitude, longitude, geoZoom, hasGeolocated]);

  const [roundedLatitude, roundedLongitude] = (markerCoordinates || [0, 0]).map(
    (coordinate) => {
      const places = 5;

      return Math.round((coordinate || 0) * 10 ** places) / 10 ** places;
    },
  );

  return (
    <div className="w-dvw">
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
          .maplibregl-ctrl,
          .maplibregl-ctrl-geocoder--input {
            border-radius: 6px;
          }
          .maplibregl-ctrl-geocoder--input:focus {
            -webkit-appearance: none;
            appearance: none;
            outline: none;
          }
          .maplibregl-ctrl-geocoder {
            width: calc(100dvw - 29px - 3*10px);
            border: 2px solid rgb(75,161,236);
          }
          .maplibregl-ctrl-geocoder--input::-webkit-search-cancel-button {
            -webkit-appearance: none;
            display: none;
          }
          .maplibregl-ctrl-geocoder--result-icon {
            display: none;
          }
        `}
      </style>

      <div className={`${loading ? "hidden" : "block"} relative`}>
        <div id={mapContainerId} className={"h-dvh"} />

        {markerCoordinates && (
          <Link
            href={`/${roundedLatitude}/${roundedLongitude}?t=${roundedLatitude}+${roundedLongitude}&${paramForNewPlace}`}
          >
            <button
              id={goButtonId}
              className="absolute bottom-[10px] inset-x-0 mx-auto border-2 border-[rgb(61,125,64)] rounded-md bg-[rgb(67,133,70)] hover:bg-[rgb(62,127,66)] active:bg-[rgb(58,119,61)] py-1 flex items-center justify-center text-base text-[rgb(255,255,255)] font-normal transition-all duration-80 transition-discrete"
              style={{
                maxWidth: "min(calc(100dvw - 2*10px), 360px)",
              }}
            >
              <div>
                {"Let's go"} <span className="animate-pulse">🚀</span>
              </div>
            </button>
          </Link>
        )}

        <button id={emptyButton} />
      </div>
    </div>
  );
};

export default HomeMap;
