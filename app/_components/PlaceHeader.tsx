"use client";

import React, { useState } from "react";
import Input from "./Input";
import CopyToClipboardButton from "./CopyToClipboardButton";
import { encodeParam } from "../_utils/url";

type PlaceHeaderProps = {
  latitude: string;
  longitude: string;
  host: string;
  title: string;
  subtitle: string;
};
const PlaceHeader = ({
  latitude,
  longitude,
  host,
  title,
  subtitle,
}: PlaceHeaderProps) => {
  const [name, setName] = useState(title);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      window.open(
        `http://${host}/test/${latitude}/${longitude}/${encodeParam(name)}`,
      );
    }
  };

  return (
    <React.Fragment>
      <div className="text-sm font-semibold my-4">
        <Input
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="mt-2 text-[#9198a1]">
          <CopyToClipboardButton text={subtitle}>
            {subtitle}
          </CopyToClipboardButton>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlaceHeader;
