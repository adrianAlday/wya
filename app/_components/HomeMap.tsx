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
import { zoom, speed, minZoom, maxZoom, essential } from "../_utils/map";
import { isStandalone } from "../_utils/isStandalone";
import { isDev } from "../_utils/isDev";
import { goButtonMaxWidthStyle } from "../_utils/styling";

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

  const [reverseName, setReverseName] = useState("");

  const mapContainerId = "map";
  const goButtonId = "go";
  const emptyButtonId = "empty";

  useEffect(() => {
    const getById = (id: string) => document.getElementById(id) as HTMLElement;

    if (!getById(mapContainerId) || hasGeolocated) {
      return;
    }

    const mapInstance = new maplibreGl.Map({
      container: mapContainerId,
      center: [longitude, latitude],
      zoom: geoZoom,
      minZoom,
      maxZoom,
      attributionControl: false,
      ...(isDev ? { hash: true } : {}),
    });

    mapInstance.setStyle(
      "https://tiles.openfreemap.org/styles/bright",
      // fallback
      // {
      //   transformStyle: (_previousStyle, nextStyle) => {
      //     nextStyle.sources.openmaptiles = {
      //       type: "vector",
      //       tiles: [
      //         "https://tiles.openfreemap.org/planet/20260513_001001_pt/{z}/{x}/{y}.pbf",
      //       ],
      //       minzoom: 0,
      //       maxzoom: 14,
      //     };
      //     return nextStyle;
      //   },
      // }
      // recent issue: https://github.com/hyperknot/openfreemap/issues/112
    );
    mapInstance.dragRotate.disable();
    mapInstance.touchZoomRotate.disableRotation();
    mapInstance.keyboard.disable();

    mapInstance.setMaxPitch(0);
    mapInstance.touchPitch.disable();

    let searchAbortController: AbortController;
    let reverseAbortController: AbortController;

    const geocoderApi = {
      forwardGeocode: async (config: { query: string }) => {
        const features = [];

        if (searchAbortController) {
          searchAbortController.abort();
        }

        searchAbortController = new AbortController();
        const signal = searchAbortController.signal;

        try {
          const { lat, lng } = mapInstance.getCenter();

          const search = await fetch("/api/search", {
            method: "POST",
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              query: config.query,
            }),
            signal,
          }).then(async (response) => await response.json());

          for (const { place } of search.mapsResult) {
            const idCenter = place.mapsId.shardedId.center;
            const center = [idCenter.lng, idCenter.lat];

            const { component } = place;
            const name = component.find(
              (component: { type: string }) =>
                component.type === "COMPONENT_TYPE_RESULT_SNIPPET",
            ).value?.[0].resultSnippet.name;
            const shortAddress = component.find(
              (component: { type: string }) =>
                component.type === "COMPONENT_TYPE_ADDRESS_OBJECT",
            ).value?.[0].addressObject.shortAddress;
            const placeName = [name, shortAddress]
              .filter((value) => ![undefined, null, ""].includes(value))
              .join(", ");

            const point = {
              center,
              geometry: {
                type: "Point",
                coordinates: center,
              },
              place_name: placeName,
            };

            features.push(point);
          }
        } catch (error) {
          if ((error as { name: string }).name === "AbortError") {
            console.log("Request was canceled");
          } else {
            console.error(`forwardGeocode Error: ${error}`);
          }
        }

        return { features };
      },
    } as MaplibreGeocoderApi;

    const setMarker = async (
      coordinates: [number, number] | null,
      nextDelay = 2,
    ) => {
      const nextCoordinates = coordinates
        ? (coordinates.map((coordinate) => {
            const places = 5;

            return Math.round((coordinate || 0) * 10 ** places) / 10 ** places;
          }) as [number, number])
        : coordinates;

      setMarkerCoordinates(nextCoordinates);

      if (reverseAbortController) {
        reverseAbortController.abort();
      }

      if (nextCoordinates) {
        const [nextLatitude, nextLongitude] = nextCoordinates;

        setReverseName(`${nextLatitude}, ${nextLongitude}`);

        reverseAbortController = new AbortController();
        const signal = reverseAbortController.signal;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${nextLatitude}&lon=${nextLongitude}&extratags=1&namedetails=1&layer=address,poi,natural`,
            { signal },
          );

          if (!response.ok) {
            throw new Error(`${response.status}`);
          }

          const reverse = await response.json();

          const reverseGeocoding = reverse.features[0].properties.geocoding;

          const constructedLabel = [
            reverseGeocoding.name,
            [reverseGeocoding.housenumber, reverseGeocoding.street]
              .filter(Boolean)
              .join(" "),
            reverseGeocoding.city,
            reverseGeocoding.extra?.opening_hours,
          ]
            .filter(Boolean)
            .join(", ");

          setReverseName(constructedLabel);
        } catch (error) {
          if ((error as { name: string }).name === "AbortError") {
            console.log("Request was canceled");
          } else if ((error as { message: string }).message === "503") {
            console.log("Retrying reverseGeocode");

            await new Promise((resolve) =>
              setTimeout(resolve, nextDelay * 1000),
            );

            setMarker(coordinates, nextDelay * 2);
          } else {
            console.error(`reverseGeocode Error: ${error}`);
          }
        }
      } else {
        setReverseName("");
      }
    };

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
      draggable: true,
    });

    mapInstance.on("load", () => {
      setLoading(false);

      mapInstance.setProjection({
        type: "globe",
      });

      geolocateControl.trigger();
    });

    geocoder.on("loading", () => {
      marker.remove();

      setMarker(initialMarkerCoordinates);
    });

    (
      document.getElementsByClassName(
        "maplibregl-ctrl-geocoder--input",
      )[0] as HTMLInputElement
    ).addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        getById(emptyButtonId).focus();
      }
    });

    geocoder.on("result", (event) => {
      const [lng, lat] = event.result.center as [number, number];

      getById(emptyButtonId).focus();

      setMarker([lat, lng]);
    });

    geolocateControl.on("geolocate", (event) => {
      if (!hasGeolocated) {
        setHasGeolocated(true);

        const { latitude, longitude } = event.coords;

        marker.setLngLat([longitude, latitude]).addTo(mapInstance);

        setMarker([latitude, longitude]);
      }
    });

    mapInstance.on("click", (event) => {
      const { lng, lat } = event.lngLat;

      geocoder.clear();

      getById(emptyButtonId).focus();

      marker.setLngLat([lng, lat]).addTo(mapInstance);

      mapInstance.flyTo({
        center: event.lngLat,
        speed,
        essential,
        ...(mapInstance.getZoom() < zoom ? { zoom } : {}),
      });

      setMarker([lat, lng]);
    });
  }, [latitude, longitude, geoZoom, hasGeolocated]);

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
          .maplibregl-ctrl-geocoder--input,
          .maplibregl-ctrl-geocoder--input:focus,
          .maplibregl-ctrl-geocoder .suggestions {
            border-radius: 6px;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
            outline: none;
          }
          .maplibregl-ctrl-top-left, 
          .maplibregl-ctrl-geocoder {
            width: calc(100dvw - 29px - 3*10px);
            max-width: 720px;
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
        <form action={"."}>
          <div id={mapContainerId} className={"h-dvh"} />
        </form>

        {markerCoordinates && (
          <Link
            href={`/${markerCoordinates[0]}/${markerCoordinates[1]}?t=${reverseName}&${paramForNewPlace}`}
          >
            <button
              id={goButtonId}
              className={`absolute ${isStandalone() ? "bottom-[36px]" : "bottom-[10px]"} inset-x-0 mx-auto border-2 border-[rgb(62,127,66)] rounded-md overflow-hidden bg-[rgb(67,133,70)] hover:bg-[rgb(62,127,66)] active:bg-[rgb(58,119,61)] py-1 flex items-center justify-center text-base text-[rgb(255,255,255)] font-normal transition-all duration-80 transition-discrete`}
              style={{
                ...goButtonMaxWidthStyle,
                boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div>
                <span className="animate-pulse">{"Let's go"}</span> 🚀
              </div>
            </button>
          </Link>
        )}

        <button id={emptyButtonId} className="absolute top-0" />
      </div>
    </div>
  );
};

export default HomeMap;
