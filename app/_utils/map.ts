import { Map, SourceSpecification } from "maplibre-gl";

export const speed = 0.6;

export const zoom = 16;

export const minZoom = 1;

export const maxZoom = 18;

export const essential = true;

export const getById = (id: string) =>
  document.getElementById(id) as HTMLElement;

export const setupMap = (mapInstance: Map) => {
  mapInstance.setStyle("https://tiles.openfreemap.org/styles/bright", {
    transformStyle: (_previousStyle, nextStyle) => {
      const mapterhornSource = {
        type: "raster-dem",
        url: "https://tiles.mapterhorn.com/tilejson.json",
      } as SourceSpecification;

      nextStyle.sources.hillshadeSource = mapterhornSource;
      nextStyle.layers.push({
        id: "hills",
        type: "hillshade",
        source: "hillshadeSource",
        layout: { visibility: "visible" },
        paint: { "hillshade-shadow-color": "rgb(71,59,36)" },
      });

      nextStyle.sources.terrainSource = mapterhornSource;
      nextStyle.terrain = {
        source: "terrainSource",
      };

      // fallback
      // recent issue: https://github.com/hyperknot/openfreemap/issues/112

      // nextStyle.sources.openmaptiles = {
      //   type: "vector",
      //   tiles: [
      //     "https://tiles.openfreemap.org/planet/20260513_001001_pt/{z}/{x}/{y}.pbf",
      //   ],
      //   minzoom: 0,
      //   maxzoom: 14,
      // };

      return nextStyle;
    },
  });
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

export const roundCoordinate = (coordinate: number, places = 5) =>
  Math.round((coordinate || 0) * 10 ** places) / 10 ** places;
