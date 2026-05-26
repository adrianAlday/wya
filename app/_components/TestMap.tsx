"use client";

import { Fragment, useEffect } from "react";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder, {
  MaplibreGeocoderApi,
} from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

type TestMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

const TestMap = ({ latitude, longitude, zoom = 16 }: TestMapProps) => {
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
    });

    mapInstance.setStyle("https://tiles.openfreemap.org/styles/bright");

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
          console.error(`Failed to forwardGeocode with error: ${error}`);
        }

        return {
          features,
        };
      },
    } as MaplibreGeocoderApi;

    const geocoder = new MaplibreGeocoder(geocoderApi, {
      maplibregl: maplibreGl,
    });

    mapInstance.addControl(geocoder);

    geocoder.on("result", (event) => {
      console.log(event);
    });
  }, [latitude, longitude, zoom]);

  return (
    <Fragment>
      <style>
        {`
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

export default TestMap;
