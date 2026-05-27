"use client";

import { useEffect } from "react";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type PlaceMapProps = {
  latitude: number;
  longitude: number;
};

const PlaceMap = ({ latitude, longitude }: PlaceMapProps) => {
  const containerId = "map";

  useEffect(() => {
    if (!document.getElementById(containerId)) {
      return;
    }

    const mapInstance = new maplibreGl.Map({
      container: containerId,
      center: [longitude, latitude],
      zoom: 16,
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
    mapInstance.keyboard.disable();
    mapInstance.touchZoomRotate.disableRotation();

    mapInstance.setRenderWorldCopies(true);

    const markerSize = 36;
    const element = document.createElement("div");
    element.textContent = "📍";
    element.style.fontSize = `${markerSize}px`;
    element.style.marginTop = `-${markerSize / 2}px`;
    new maplibreGl.Marker({ element })
      .setLngLat(mapInstance.getCenter())
      .addTo(mapInstance);
  }, [latitude, longitude]);

  return (
    <div
      id={containerId}
      className="rounded-md my-3 h-lvw"
      style={{
        height: "calc(100dvw - 2*4*4px)",
        maxHeight: 600 - 2 * 4 * 4,
      }}
    />
  );
};

export default PlaceMap;
