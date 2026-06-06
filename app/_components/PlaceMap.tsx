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
import { buttonStateTransitionClasses } from "../_utils/styling";
import { useToast } from "./ToastContext";

type PlaceMapProps = {
  latitude: number;
  longitude: number;
};

const PlaceMap = ({ latitude, longitude }: PlaceMapProps) => {
  const mapContainerId = "map";
  const recenterButtonId = "recenter";

  const { addToast } = useToast();

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
    const backgroundColor = "rgb(247,248,250)";
    measureDistance.style.backgroundColor = backgroundColor;
    clearMeasurements.style.backgroundColor = backgroundColor;

    measureDistance.innerHTML = `<svg viewBox="0 0 197.983 86.1377" xmlns="http://www.w3.org/2000/svg"><path d="M197.983 21.3916C197.983 7.42676 190.493 0 176.338 0L21.4551 0C7.36328 0 0 7.42676 0 21.3916L0 64.7461C0 78.7109 7.42676 86.1377 21.5186 86.1377L176.401 86.1377C190.557 86.1377 197.983 78.7109 197.983 64.7461ZM186.621 23.2959L186.621 62.9053C186.621 70.7129 182.305 74.9023 174.751 74.9023L23.1055 74.9023C15.5518 74.9023 11.2354 70.7129 11.2354 62.9053L11.2354 23.2959C11.2354 15.4883 15.5518 11.2354 23.1689 11.2354L174.814 11.2354C182.305 11.2354 186.621 15.4883 186.621 23.2959ZM29.6436 7.23633L23.4863 7.23633L23.4863 49.6387C23.4863 51.4795 24.8828 52.6855 26.5967 52.6855C28.374 52.6855 29.6436 51.416 29.6436 49.5752ZM44.1162 7.23633L38.0225 7.23633L38.0225 35.3564C38.0225 37.1973 39.3555 38.4033 41.0693 38.4033C42.9102 38.4033 44.1162 37.1338 44.1162 35.293ZM58.5889 7.23633L52.4951 7.23633L52.4951 35.3564C52.4951 37.1973 53.8281 38.4033 55.542 38.4033C57.3828 38.4033 58.5889 37.1338 58.5889 35.293ZM72.998 7.23633L66.9043 7.23633L66.9043 35.3564C66.9043 37.1973 68.2373 38.4033 69.9512 38.4033C71.792 38.4033 72.998 37.1338 72.998 35.293ZM87.5342 7.23633L81.4404 7.23633L81.4404 35.3564C81.4404 37.1973 82.7734 38.4033 84.4873 38.4033C86.3281 38.4033 87.5342 37.1338 87.5342 35.293ZM102.07 7.23633L95.9766 7.23633L95.9766 49.6387C95.9766 51.4795 97.3096 52.6855 99.0234 52.6855C100.864 52.6855 102.07 51.416 102.07 49.5752ZM116.543 7.23633L110.386 7.23633L110.386 35.3564C110.386 37.1973 111.782 38.4033 113.496 38.4033C115.273 38.4033 116.543 37.1338 116.543 35.293ZM131.016 7.23633L124.922 7.23633L124.922 35.3564C124.922 37.1973 126.255 38.4033 127.969 38.4033C129.81 38.4033 131.016 37.1338 131.016 35.293ZM145.488 7.23633L139.395 7.23633L139.395 35.3564C139.395 37.1973 140.728 38.4033 142.441 38.4033C144.219 38.4033 145.488 37.1338 145.488 35.293ZM159.961 7.23633L153.867 7.23633L153.867 35.3564C153.867 37.1973 155.2 38.4033 156.914 38.4033C158.755 38.4033 159.961 37.1338 159.961 35.293ZM174.434 7.23633L168.34 7.23633L168.34 49.6387C168.34 51.4795 169.673 52.6855 171.387 52.6855C173.228 52.6855 174.434 51.416 174.434 49.5752Z" fill="rgb(38,41,46)"/></svg>`;
    clearMeasurements.innerHTML = `<svg viewBox="0 0 128.429 128.556" xmlns="http://www.w3.org/2000/svg"><path d="M1.78536 126.771C4.26094 129.119 8.19649 129.119 10.6086 126.771L64.1828 73.133L117.821 126.771C120.169 129.119 124.232 129.183 126.58 126.771C128.992 124.295 128.992 120.36 126.58 118.011L73.0061 64.3732L126.58 10.7356C128.992 8.38692 129.056 4.3879 126.58 1.97579C124.168-0.372845 120.169-0.372845 117.821 1.97579L64.1828 55.6135L10.6086 1.97579C8.19649-0.372845 4.19747-0.436322 1.78536 1.97579C-0.563275 4.45137-0.563275 8.38692 1.78536 10.7356L55.4231 64.3732L1.78536 118.011C-0.563275 120.36-0.626752 124.359 1.78536 126.771Z" fill="rgb(38,41,46)"/></svg>`;
    measureDistance.style.padding = "4px";
    clearMeasurements.style.padding = "8px";

    measureArea.style.display = "none";
    clearMeasurements.style.display = "none";

    clearMeasurements.style.borderTopWidth = "0px";

    measureDistance.addEventListener("click", () => {
      measureDistance.style.display = "none";
      clearMeasurements.style.display = "block";

      addToast({ title: "Tap to measure" });
    });
    clearMeasurements.addEventListener("click", () => {
      clearMeasurements.style.display = "none";
      measureDistance.style.display = "block";
    });
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <style>
        {`
          .maplibregl-ctrl-bottom-right .maplibregl-ctrl {
            margin: 0px 16px 16px 0px;
          }
          .maplibregl-ctrl-group button {
            height: 32px;
            width: 32px;
          }
        `}
      </style>
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
        className={`absolute bottom-4 inset-x-0 mx-auto border border-[rgb(211,217,223)] rounded-md max-w-[180px] bg-[rgb(247,248,250)] hover:bg-[rgb(239,242,245)] active:hover:bg-[rgb(231,234,238)] py-1 flex items-center justify-center text-[rgb(38,41,46)] text-base font-medium ${buttonStateTransitionClasses}`}
        style={{
          display: "none",
        }}
      >
        Recenter
      </button>
    </div>
  );
};

export default PlaceMap;
