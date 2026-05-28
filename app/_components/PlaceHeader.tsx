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

  const initiallyHadParamForNewPlace = searchParams.has(paramForNewPlace);

  const nameInputId = "name";

  useEffect(() => {
    if (initiallyHadParamForNewPlace) {
      document.getElementById(nameInputId)?.focus();
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

  const setNameAndUrl = (value: string) => {
    setName(value);

    setUrl(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameAndUrl(event.target.value);
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

  const showClearButton = initiallyHadParamForNewPlace && !!name.length;

  return (
    <React.Fragment>
      <div className="font-semibold">
        <div className="relative">
          <input
            id={nameInputId}
            type="text"
            enterKeyHint="done"
            placeholder={"Name"}
            value={name}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className={`border border-[#3d444d] focus:border-2 focus:border-[rgb(54,113,227)] focus:-m-px w-full py-2 ${showClearButton ? "pl-5 pr-10" : "px-5"} text-base`}
            style={{
              borderRadius:
                "calc( ( min( (600px - 2*4*4px), (100dvw - 2*4*4px) ) - 3*16px) * 0.25 * 0.225 )",
            }}
          />

          {showClearButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 pr-5 pl-2 py-1 text-xl hover:text-[rgb(74,119,145)]"
              onClick={() => {
                setNameAndUrl("");
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="py-2 px-5 text-sm text-[#9198a1] hover:text-[#f0f6fc] active:text-[#ab7df8]">
          <button onClick={handleSubtitleClick} className="cursor-pointer">
            {subtitle}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlaceHeader;
