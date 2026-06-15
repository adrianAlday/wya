"use client";

import { useState, useRef, useEffect } from "react";
import PlaceHeader from "./PlaceHeader";
import PlaceMap from "./PlaceMap";

type PlaceTopSection = {
  initialTitle: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  geoJson: null | [number, number][];
};

const PlaceTopSection = ({
  initialTitle,
  subtitle,
  latitude,
  longitude,
  geoJson,
}: PlaceTopSection) => {
  const [title, setTitle] = useState(initialTitle);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;

    if (header) {
      setHeaderHeight(header.scrollHeight);
    }
  }, [title]);

  return (
    <div>
      <PlaceHeader
        title={title}
        setTitle={setTitle}
        subtitle={subtitle}
        headerRef={headerRef}
      />

      <PlaceMap
        latitude={latitude}
        longitude={longitude}
        headerHeight={headerHeight}
        geoJson={geoJson}
      />
    </div>
  );
};

export default PlaceTopSection;
