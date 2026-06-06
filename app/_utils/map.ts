import { Map } from "maplibre-gl";

export const speed = 0.6;

export const zoom = 16;

export const minZoom = 1;

export const maxZoom = 18;

export const essential = true;

export const getById = (id: string) =>
  document.getElementById(id) as HTMLElement;

export const setupMap = (mapInstance: Map) => {
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
};

export const generateMarkerElementOption = () => {
  const markerSize = 36;
  const element = document.createElement("div");
  element.textContent = "📍";
  element.style.fontSize = `${markerSize}px`;
  element.style.marginTop = `-${markerSize / 2}px`;
  return { element };
};
