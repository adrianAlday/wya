"use client";

import { useEffect } from "react";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  speed,
  zoom,
  minZoom,
  essential,
  getById,
  setupMap,
  generateMarkerElementOption,
} from "../_utils/map";
import MeasuresControl from "maplibre-gl-measures";
import { isDev } from "../_utils/isDev";

type PlaceMapProps = {
  latitude: number;
  longitude: number;
};

const PlaceMap = ({ latitude, longitude }: PlaceMapProps) => {
  const mapContainerId = "map";
  const recenterButtonId = "recenter";

  useEffect(() => {
    if (!getById(mapContainerId)) {
      return;
    }

    const initialPosition = {
      center: [longitude, latitude] as [number, number],
      zoom,
    };

    const mapInstance = new maplibreGl.Map({
      container: mapContainerId,
      ...initialPosition,
      minZoom,
      attributionControl: false,
      ...(isDev ? {} : {}),
    });

    setupMap(mapInstance);

    mapInstance.on("load", () => {
      mapInstance.setProjection({
        type: "globe",
      });
    });

    new maplibreGl.Marker(generateMarkerElementOption())
      .setLngLat(mapInstance.getCenter())
      .addTo(mapInstance);

    const recenterButton = getById(recenterButtonId);

    mapInstance.on("movestart", () => {
      recenterButton.style.display = "block";
    });

    recenterButton.addEventListener("click", () => {
      mapInstance.flyTo({
        ...initialPosition,
        speed,
        essential,
      });

      mapInstance.once("move", () => {
        recenterButton.style.display = "none";
      });
    });

    const measureDistanceTitle = "Measure Distance";
    const measureAreaTitle = "Measure Area";
    const clearMeasurementsTitle = "Clear measurements";

    mapInstance.addControl(
      new MeasuresControl({
        lang: {
          lengthMeasurementButtonTitle: measureDistanceTitle,
          areaMeasurementButtonTitle: measureAreaTitle,
          clearMeasurementsButtonTitle: clearMeasurementsTitle,
        },
        showOnlyTotalLineLength: true,
        style: {
          text: { font: "-apple-system", color: "rgb(0,0,0)" },
          common: {
            midPointColor: "rgb(0,0,0)",
          },
          lengthMeasurement: {
            lineColor: "rgb(0,0,0)",
          },
        },
      }),
      "bottom-right",
    );

    const measureDistance = document.querySelector(
      `[title="${measureDistanceTitle}"]`,
    ) as HTMLButtonElement;
    const measureArea = document.querySelector(
      `[title="${measureAreaTitle}"]`,
    ) as HTMLButtonElement;
    const clearMeasurements = document.querySelector(
      `[title="${clearMeasurementsTitle}"]`,
    ) as HTMLButtonElement;

    const borderRadius = "6px";
    measureDistance.style.borderRadius = borderRadius;
    clearMeasurements.style.borderRadius = borderRadius;

    measureArea.style.display = "none";
    clearMeasurements.style.display = "none";

    measureDistance.addEventListener("click", () => {
      measureDistance.style.display = "none";
      clearMeasurements.style.display = "block";
    });
    clearMeasurements.addEventListener("click", () => {
      clearMeasurements.style.display = "none";
      measureDistance.style.display = "block";
    });
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <div
        id={mapContainerId}
        className="mb-4 rounded-md"
        style={{
          height:
            "calc( 100dvh - 2*4*4px - 70px - 48px - (( min((100dvw - 2*4*4px), (600px - 2*4*4px)) - 3*4*4px ) / 4 * 2 + 4*4px ) )",
          maxHeight: 600 - 2 * 4 * 4,
        }}
      />

      <button
        id={recenterButtonId}
        className="absolute bottom-4 inset-x-0 mx-auto border border-[rgb(211,217,223)] rounded-md max-w-[180px] bg-[rgb(247,248,250)] hover:bg-[rgb(239,242,245)] active:hover:bg-[rgb(231,234,238)] py-1 flex items-center justify-center text-[rgb(38,41,46)] text-base font-medium transition-all duration-80 transition-discrete"
        style={{
          display: "none",
        }}
      >
        <div>{"Recenter"}</div>
      </button>
    </div>
  );
};

export default PlaceMap;
