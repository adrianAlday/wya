"use client";

import React, { useEffect, useState } from "react";
import { encodeParam } from "../_utils/url";
import { usePathname, useSearchParams } from "next/navigation";
import { paramForNewPlace } from "./HomeMap";

type PlaceHeaderProps = {
  title: string;
  subtitle: string;
};
const PlaceHeader = ({ title, subtitle }: PlaceHeaderProps) => {
  const [name, setName] = useState(title);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputId = "name";

  useEffect(() => {
    if (searchParams.has(paramForNewPlace)) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      input.click();
    }
  }, []);

  const setUrl = (nameValue: string) => {
    const newUrl = `${pathname}?t=${encodeParam(nameValue)}`;

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
      <div className="text-sm font-semibold mb-4">
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

        <div className="mt-2 px-3 text-[#9198a1] hover:text-[#f0f6fc] active:text-[#ab7df8]">
          <button onClick={handleSubtitleClick} className="cursor-pointer">
            {subtitle}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlaceHeader;
