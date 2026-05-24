"use client";

import { useEffect } from "react";
import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapProps = {
  latitude: number;
  longitude: number;
};

const Map = ({ latitude, longitude }: MapProps) => {
  const containerId = "map";

  useEffect(() => {
    if (!document.getElementById(containerId)) {
      return;
    }

    const mapInstance = new maplibreGl.Map({
      container: containerId,
      center: [longitude, latitude],
      zoom: 16,
      // style: "https://tiles.openfreemap.org/styles/bright",
      attributionControl: false,
    });

    mapInstance.setStyle("https://tiles.openfreemap.org/styles/bright", {
      transformStyle: (_previousStyle, nextStyle) => {
        nextStyle.sources.openmaptiles = {
          type: "vector",
          tiles: [
            "https://tiles.openfreemap.org/planet/20260513_001001_pt/{z}/{x}/{y}.pbf",
          ],
          minzoom: 0,
          maxzoom: 14,
        };

        return nextStyle;
      },
    });

    const markerSize = 36;
    const element = document.createElement("div");
    element.textContent = "📍";
    element.style.fontSize = `${markerSize}px`;
    element.style.marginTop = `-${markerSize / 2}px`;
    new maplibreGl.Marker({ element })
      .setLngLat(mapInstance.getCenter())
      .addTo(mapInstance);
  }, [latitude, longitude]);

  return <div id={containerId} className="rounded-md h-80 py-3" />;
};

export default Map;
