"use client";

import { useEffect } from "react";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { speed, zoom, essential } from "../_utils/map";

type PlaceMapProps = {
  latitude: number;
  longitude: number;
};

const PlaceMap = ({ latitude, longitude }: PlaceMapProps) => {
  const mapContainerId = "map";
  const recenterButtonId = "recenter";

  useEffect(() => {
    if (!document.getElementById(mapContainerId)) {
      return;
    }

    const initialPosition = {
      center: [longitude, latitude] as [number, number],
      zoom,
    };

    const mapInstance = new maplibreGl.Map({
      container: mapContainerId,
      ...initialPosition,
      attributionControl: false,
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

    mapInstance.setRenderWorldCopies(true);

    const markerSize = 36;
    const element = document.createElement("div");
    element.textContent = "📍";
    element.style.fontSize = `${markerSize}px`;
    element.style.marginTop = `-${markerSize / 2}px`;
    new maplibreGl.Marker({ element })
      .setLngLat(mapInstance.getCenter())
      .addTo(mapInstance);

    const recenterButton = document.getElementById(
      recenterButtonId,
    ) as HTMLElement;

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
