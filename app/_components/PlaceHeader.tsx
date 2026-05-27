"use client";

import React, { useEffect, useState } from "react";
import { encodeParam } from "../_utils/url";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();

  const inputId = "name";

  useEffect(() => {
    if (searchParams.has("n")) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      input.focus();
      input.select();
    }
  }, []);

  const setUrl = (nameValue: string) => {
    const newUrl = `http://${host}/${latitude}/${longitude}/${encodeParam(nameValue)}`;

    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);

    setUrl(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      (document.activeElement as HTMLInputElement).blur();
    }
  };

  const handleInputBlur = () => {
    setUrl(name);
  };

  const handleSubtitleClick = () => {
    navigator.clipboard.writeText(subtitle.replaceAll(" ", ""));
  };

  return (
    <React.Fragment>
      <div className="text-sm font-semibold my-4">
        <input
          id={inputId}
          type="text"
          placeholder={"Name"}
          value={name}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="border border-[#3d444d] focus:border-2 focus:border-[rgb(54,113,227)] focus:-m-px rounded-md w-full py-1 px-3 text-base"
        />

        <div className="mt-2 px-3 text-[#9198a1]">
          <button onClick={handleSubtitleClick} className="cursor-pointer">
            {subtitle}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlaceHeader;
