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

type SandboxMapProps = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const SandboxMap = ({ latitude, longitude, zoom }: SandboxMapProps) => {
  const [markerCoordinates, setMarkerCoordinates] = useState([0, 0]);

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

    const generateMarkerElement = () => {
      const markerSize = 36;
      const element = document.createElement("div");
      element.textContent = "📍";
      element.style.fontSize = `${markerSize}px`;
      element.style.marginTop = `-${markerSize / 2}px`;

      return element;
    };

    const markerSize = 36;
    const element = document.createElement("div");
    element.textContent = "📍";
    element.style.fontSize = `${markerSize}px`;
    element.style.marginTop = `-${markerSize / 2}px`;

    const geocoder = new MaplibreGeocoder(geocoderApi, {
      enableEventLogging: false,
      limit: 3,
      maplibregl: maplibreGl,

      // marker: { element: generateMarkerElement() } as unknown as Marker,
      marker: { element } as unknown as Marker,
      // marker: false,

      placeholder: "Where to?",
      proximity: { latitude, longitude },

      showResultMarkers: { element: generateMarkerElement() },
      // showResultMarkers: { element },
      // showResultMarkers: false,

      showResultsWhileTyping: true,
    });

    geocoder.on("result", (event) => {
      console.log(event);
    });

    mapInstance.addControl(geocoder, "top-left");

    mapInstance.on("click", (event) => {
      console.log(event);

      mapInstance.flyTo({
        center: event.lngLat,
      });

      setMarkerCoordinates([event.lngLat.lat, event.lngLat.lng]);

      console.log(markerCoordinates);

      new Marker({
        draggable: true,
        // element: generateMarkerElement(),
        element,
      })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .addTo(mapInstance);
    });

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
      trackUserLocation: true,
      showAccuracyCircle: true,
    });

    mapInstance.addControl(geolocateControl, "top-right");

    mapInstance.on("load", () => {
      geolocateControl.trigger();
    });

    mapInstance.addControl(
      new NavigationControl({
        visualizePitch: false,
        visualizeRoll: false,
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );
  }, [latitude, longitude, zoom, markerCoordinates]);

  return (
    <Fragment>
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

      <div
        id={containerId}
        className="rounded-md my-3 h-lvw"
        style={{
          maxHeight: 600 - 4 * 8,
        }}
      />
    </Fragment>
  );
};

export default SandboxMap;
