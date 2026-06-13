"use client";

import { useEffect, useState } from "react";
import maplibreGl, { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  speed,
  zoom,
  minZoom,
  maxZoom,
  essential,
  getById,
  setupMap,
  generateMarkerElementOption,
  roundCoordinate,
} from "../_utils/map";
import MeasuresControl from "maplibre-gl-measures";
import { isDev } from "../_utils/isDev";
import {
  mapButtonShadowStyle,
  buttonStateTransitionClasses,
  squircleButtonBackgroundClass,
} from "../_utils/styling";
import { useToast } from "./ToastContext";
import * as turf from "@turf/turf";
import { FeatureCollection, LineString } from "geojson";

type PlaceMapProps = {
  latitude: number;
  longitude: number;
  headerHeight: number;
  geoJson: null | [number, number][];
  routeMarkerText: null | string;
};

const PlaceMap = ({
  latitude,
  longitude,
  headerHeight,
  geoJson,
  routeMarkerText,
}: PlaceMapProps) => {
  const [loading, setLoading] = useState(true);

  const mapContainerId = "map";
  const resetMapButtonId = "reset";

  const { addToast } = useToast();

  useEffect(() => {
    if (!getById(mapContainerId)) {
      return;
    }

    const initialCoordinates = [longitude, latitude] as [number, number];

    const initialPosition = {
      center: initialCoordinates,
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

    const initialCenter = new maplibreGl.LngLat(...initialCoordinates);

    new maplibreGl.Marker(generateMarkerElementOption())
      .setLngLat(initialCenter)
      .addTo(mapInstance);

    const geolocateControl = new maplibreGl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
      showAccuracyCircle: true,
    });

    mapInstance.addControl(geolocateControl, "top-right");

    mapInstance.addControl(
      new maplibreGl.NavigationControl({
        visualizePitch: false,
        visualizeRoll: false,
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );

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

    const resetMapButton = getById(resetMapButtonId);

    const compareCenters = (a: maplibreGl.LngLat, b: maplibreGl.LngLat) =>
      roundCoordinate(a.lat) !== roundCoordinate(b.lat) ||
      roundCoordinate(a.lng) !== roundCoordinate(b.lng);

    mapInstance.on("load", () => {
      mapInstance.setProjection({
        type: "globe",
      });

      if (geoJson) {
        const cleanGeoJson = turf.cleanCoords(turf.lineString(geoJson)).geometry
          .coordinates;

        const fitGeoJson = () => {
          mapInstance.fitBounds(
            cleanGeoJson.reduce(
              (
                bounds: maplibreGl.LngLatBounds,
                coordinates: [number, number],
              ) => bounds.extend(coordinates),
              new maplibreGl.LngLatBounds(
                initialCoordinates,
                initialCoordinates,
              ),
            ),
            {
              padding: { top: 36, bottom: 16, left: 16, right: 16 + 32 + 16 },
              maxZoom,
            },
          );
        };

        fitGeoJson();

        const lineString = turf.lineString(cleanGeoJson);

        const meterUnitsOptions = {
          units: "meters" as turf.helpers.Units,
        };

        const totalMeters = turf.length(lineString, meterUnitsOptions);

        let currentDistance = 0;

        const segments = [];

        const terrainResolutionMeters = 10;

        const segmentMeters = terrainResolutionMeters * 5;

        while (currentDistance < totalMeters) {
          let nextDistance = currentDistance + segmentMeters;

          if (nextDistance > totalMeters) {
            nextDistance = totalMeters;
          }

          const segment = turf.lineSliceAlong(
            lineString,
            currentDistance,
            nextDistance,
            meterUnitsOptions,
          );

          segment.properties = {
            distanceMeters: nextDistance - currentDistance,
            startDistance: currentDistance,
            endDistance: nextDistance,
          };

          segments.push(segment);

          currentDistance = nextDistance;
        }

        const featureCollection = turf.featureCollection(segments);

        featureCollection.features.forEach((feature) => {
          const coordinates = feature.geometry.coordinates;

          const startCoordinates = coordinates[0] as [number, number];
          const endCoordinates = coordinates[coordinates.length - 1] as [
            number,
            number,
          ];

          const startElevation =
            mapInstance.queryTerrainElevation(startCoordinates) || 0;
          const endElevation =
            mapInstance.queryTerrainElevation(endCoordinates) || 0;

          if (!feature.properties) {
            feature.properties = {};
          }

          const rise = endElevation - startElevation;
          const run = feature.properties.distanceMeters;
          const slopePercent = run > 0 ? (rise / run) * 100 : 0;

          feature.properties.slope = slopePercent;
          feature.properties.startElevation = startElevation;
          feature.properties.endElevation = endElevation;
        });

        mapInstance.once("idle", async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000 * 1));

          const fittedCenter = mapInstance.getCenter();

          mapInstance.on("moveend", () => {
            if (compareCenters(mapInstance.getCenter(), fittedCenter)) {
              resetMapButton.style.display = "block";
            }

            resetMapButton.addEventListener("click", () => {
              fitGeoJson();

              mapInstance.once("move", () => {
                resetMapButton.style.display = "none";
              });
            });
          });

          const routeSourceName = "route";

          const shownFeatureCollecion = {
            type: "FeatureCollection",
            features: [],
          } as FeatureCollection<LineString>;

          mapInstance.addSource(routeSourceName, {
            type: "geojson",
            data: shownFeatureCollecion,
          });

          const routeSource = mapInstance.getSource(
            routeSourceName,
          ) as GeoJSONSource;

          const slopePercentForColor = 2;

          mapInstance.addLayer({
            source: routeSourceName,
            id: routeSourceName,
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-width": 2,
              "line-color": [
                "step",
                ["get", "slope"],
                "rgba(48,108,188,1.0)",
                -1 * slopePercentForColor,
                "rgba(139,81,119,0.5)",
                slopePercentForColor,
                "rgba(230,54,49,1.0)",
              ],
            },
          });

          let animateCounter = 0;

          const refreshRate = 120;

          const chunkSize = Math.floor(
            featureCollection.features.length / refreshRate,
          );

          const markerSize = 16;

          const routeElement = document.createElement("div");
          if (routeMarkerText) {
            routeElement.textContent = routeMarkerText;
            routeElement.style.fontSize = `${markerSize}px`;
          } else {
            routeElement.style.width = `${(markerSize * 2) / 3}px`;
            routeElement.style.height = `${(markerSize * 2) / 3}px`;
            routeElement.style.backgroundColor = "rgb(255,255,255)";
            routeElement.style.borderRadius = "50%";
            routeElement.style.border = "2px solid rgba(0,0,0,0.5)";
          }

          const startCoordinates = featureCollection.features[0].geometry
            .coordinates[0] as [number, number];

          const routeMarker = new maplibreGl.Marker({
            element: routeElement,
          })
            .setLngLat(startCoordinates)
            .addTo(mapInstance);

          const miles = Array.from(
            {
              length: Math.floor(
                turf.convertLength(totalMeters, "meters", "miles"),
              ),
            },
            (_, index) => index + 1,
          ).map((mile) => ({
            mile,
            meters: turf.convertLength(mile, "miles", "meters"),
            coordinates: turf.along(lineString, mile, {
              units: "miles",
            }).geometry.coordinates,
          }));

          const generateMileMarker = (mile: number) => {
            const mileMarkerElement = document.createElement("div");
            mileMarkerElement.textContent = `${mile}`;
            mileMarkerElement.style.fontSize = `${markerSize}px`;
            mileMarkerElement.style.color = "rgb(38,41,46)";
            mileMarkerElement.style.textShadow = "1px 1px 2px rgb(247,248,250)";

            return mileMarkerElement;
          };

          const animateRoute = async () => {
            // set max index?
            // is route trailing a little behind marker?

            const isFirstLoop =
              animateCounter * chunkSize < featureCollection.features.length;

            if (
              !isFirstLoop &&
              (animateCounter * chunkSize) % featureCollection.features.length <
                ((animateCounter - 1) * chunkSize) %
                  featureCollection.features.length
            ) {
              routeMarker.remove();

              await new Promise((resolve) => setTimeout(resolve, 1000 * 2));

              routeMarker.setLngLat(startCoordinates).addTo(mapInstance);
            }

            if (isFirstLoop) {
              const featuresToAdd = featureCollection.features.slice(
                animateCounter * chunkSize,
                animateCounter * chunkSize + chunkSize,
              );

              shownFeatureCollecion.features.push(...featuresToAdd);
              await routeSource.setData(shownFeatureCollecion);

              miles
                .filter(
                  (mile) =>
                    mile.meters > featuresToAdd[0].properties?.startDistance &&
                    mile.meters <=
                      featuresToAdd.reverse()[0].properties?.endDistance,
                )
                .forEach((mile) => {
                  new maplibreGl.Marker({
                    element: generateMileMarker(mile.mile),
                  })
                    .setLngLat(mile.coordinates as [number, number])
                    .addTo(mapInstance);
                });
            }

            routeMarker.setLngLat(
              featureCollection.features[
                (animateCounter * chunkSize) % featureCollection.features.length
              ].geometry.coordinates.at(-1) as [number, number],
            );

            await new Promise((resolve) =>
              setTimeout(resolve, (1000 * 1) / refreshRate),
            );

            requestAnimationFrame(animateRoute);

            animateCounter = animateCounter + 1;
          };

          await new Promise((resolve) => setTimeout(resolve, 1000 * 0.1));
          animateRoute();
        });
      } else {
        mapInstance.on("moveend", () => {
          if (compareCenters(mapInstance.getCenter(), initialCenter)) {
            resetMapButton.style.display = "block";
          }

          resetMapButton.addEventListener("click", () => {
            mapInstance.flyTo({
              ...initialPosition,
              speed,
              essential,
            });

            mapInstance.once("move", () => {
              resetMapButton.style.display = "none";
            });
          });
        });
      }

      setLoading(false);
    });
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <div
        className={`z-50 absolute inset-0 rounded-md ${squircleButtonBackgroundClass} animate-pulse flex items-center justify-center ${loading ? "block" : "hidden"}`}
      >
        <div className="mb-12">
          <svg
            className="size-5 animate-spin text-[rgb(240,246,252)]"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      <style>
        {`
          .maplibregl-ctrl-top-right .maplibregl-ctrl {
            margin: 16px 16px 0px 0px;
          }
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
        className={"mb-4 rounded-md"}
        style={{
          height: `calc( 100dvh - 16px - ${headerHeight}px - 16px - (( min((100dvw - 2*16px), (600px - 2*16px)) - 3*16px ) / 4 * 2 + 16px ) - 32px - 16px)`,
          maxHeight: 600 - 2 * 4 * 4,
          opacity: loading ? 0 : 100,
        }}
      />

      <button
        id={resetMapButtonId}
        className={`absolute bottom-4 inset-x-0 mx-auto rounded-md max-w-[180px] bg-[rgb(247,248,250)] hover:bg-[rgb(239,242,245)] active:hover:bg-[rgb(231,234,238)] py-1 flex items-center justify-center text-[rgb(38,41,46)] text-base font-medium ${buttonStateTransitionClasses}`}
        style={{
          display: "none",
          ...mapButtonShadowStyle,
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default PlaceMap;
