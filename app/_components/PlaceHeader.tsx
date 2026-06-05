"use client";

import React, { useEffect, useRef, useState } from "react";
import { encodeParam } from "../_utils/url";
import { usePathname, useSearchParams } from "next/navigation";
import { paramForNewPlace } from "./HomeMap";
import { useToast } from "./ToastContext";
import { useKeyboardOpen } from "../_utils/useKeyboardOpen";

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

  const setNameUrlAndTitle = (value: string) => {
    setName(value);

    setUrl(value);

    document.title = value || subtitle;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameUrlAndTitle(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      (document.activeElement as HTMLInputElement).blur();
    }
  };

  const { isKeyboardOpen, hasKeyboardOpened } = useKeyboardOpen();

  const { addToast } = useToast();

  const handleDoneWithInput = () => {
    setUrl(name);

    addToast({ title: "Title saved", subtitle: name });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (!isKeyboardOpen) {
      handleDoneWithInput();
    }
  }, [isKeyboardOpen]);

  const showClearButton = initiallyHadParamForNewPlace && !!name.length;

  const handleSubtitleClick = () => {
    navigator.clipboard.writeText(subtitle.replaceAll(" ", ""));

    addToast({ title: "Coordinates copied", subtitle: subtitle });
  };

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
            onBlur={() => {
              if (!hasKeyboardOpened) {
                handleDoneWithInput();
              }
            }}
            className={`border border-[#3d444d] focus:border-2 focus:border-[rgb(54,113,227)] focus:-m-px rounded-md w-full py-1 ${showClearButton ? "pl-3 pr-9" : "px-3"} text-base`}
          />

          {showClearButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 pl-2 py-1 hover:text-[rgb(54,113,227)]"
              onMouseDown={() => {
                setNameUrlAndTitle("");
              }}
            >
              <svg height={16} viewBox="0 0 35.9517 35.6001">
                <path
                  d="M0.494407 35.1057C1.17995 35.7561 2.2698 35.7561 2.93777 35.1057L17.7737 20.2522L32.6272 35.1057C33.2776 35.7561 34.4026 35.7737 35.053 35.1057C35.721 34.4202 35.721 33.3303 35.053 32.68L20.2171 17.8264L35.053 2.97292C35.721 2.32253 35.7385 1.21511 35.053 0.547141C34.385-0.10325 33.2776-0.10325 32.6272 0.547141L17.7737 15.4007L2.93777 0.547141C2.2698-0.10325 1.16238-0.120828 0.494407 0.547141C-0.155984 1.23269-0.155984 2.32253 0.494407 2.97292L15.3479 17.8264L0.494407 32.68C-0.155984 33.3303-0.173562 34.4378 0.494407 35.1057Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>

        <button
          className="py-2 px-3 text-sm text-[#9198a1] hover:text-[#f0f6fc] active:text-[#ab7df8] cursor-pointer"
          onClick={handleSubtitleClick}
        >
          {subtitle}
        </button>
      </div>
    </React.Fragment>
  );
};

export default PlaceHeader;
