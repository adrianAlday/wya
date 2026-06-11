"use client";

import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { encodeParam, generateQueryString, replaceUrl } from "../_utils/url";
import { usePathname, useSearchParams } from "next/navigation";
import { paramForNewPlace } from "./HomeMap";
import { useToast } from "./ToastContext";
import { useKeyboardOpen } from "../_utils/useKeyboardOpen";
import { borderClasses, buttonStateTransitionClasses } from "../_utils/styling";

type PlaceHeaderProps = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  subtitle: string;
  headerRef: RefObject<HTMLDivElement | null>;
};

const PlaceHeader = ({
  title,
  setTitle,
  subtitle,
  headerRef,
}: PlaceHeaderProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const titleSectionRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const initiallyHadParamForNewPlace = searchParams.has(paramForNewPlace);

  useEffect(() => {
    if (initiallyHadParamForNewPlace) {
      textAreaRef.current?.focus();

      const length = textAreaRef.current?.value.length as number;
      textAreaRef.current?.setSelectionRange(length, length);
    }
  }, []);

  const changeParams = (newParams: { [key: string]: string }) => {
    const originalParams = [
      { key: "t", value: "" },
      ...["garmin_course", "strava_activity", "strava_route", "m"]
        .filter((key) => searchParams.get(key))
        .map((presentKey) => ({
          key: presentKey,
          value: searchParams.get(presentKey) as string,
        })),
    ];

    replaceUrl(`${pathname}?${generateQueryString(originalParams, newParams)}`);
  };

  const setTitleStateAndUrl = (value: string) => {
    setTitle(value);

    changeParams({ t: value });

    document.title = value || subtitle;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitleStateAndUrl(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      (document.activeElement as HTMLTextAreaElement).blur();
    }
  };

  useEffect(() => {
    const textArea = textAreaRef.current;

    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight + 4}px`;
    }
  }, [title]);

  const showClearButton = initiallyHadParamForNewPlace && !!title.length;

  const handleClearClick = () => {
    textAreaRef.current?.focus();

    setTitleStateAndUrl("");
  };

  const { isKeyboardOpen, hasKeyboardOpened } = useKeyboardOpen();

  const { addToast } = useToast();

  const handleDoneWithInput = () => {
    changeParams({ t: title });

    addToast({ title: "Title saved", subtitle: title });
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

  const handleTitleBlur = () => {
    setTimeout(() => {
      if (titleSectionRef.current?.contains(document.activeElement)) {
        return;
      }

      if (!hasKeyboardOpened) {
        handleDoneWithInput();
      }
    }, 0);
  };

  const handleSubtitleClick = () => {
    navigator.clipboard.writeText(subtitle.replaceAll(" ", ""));

    addToast({ title: "Coordinates copied", subtitle: subtitle });
  };

  return (
    <div className="font-semibold" ref={headerRef}>
      <div ref={titleSectionRef} onBlur={handleTitleBlur} className="relative">
        <textarea
          ref={textAreaRef}
          rows={1}
          enterKeyHint="done"
          placeholder={"Title?"}
          value={title}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className={`${borderClasses} border-2 border-[rgb(22,27,34)] focus:border-2 focus:border-[rgb(54,113,227)] rounded-md w-full py-1 resize-none ${showClearButton ? "pl-3 pr-9" : "px-3"} text-base`}
        />

        <button
          className={`absolute right-0 bottom-2.5 pr-3 pl-2 py-1 hover:text-[rgb(54,113,227)] ${buttonStateTransitionClasses} ${showClearButton ? "" : "hidden"}`}
          onClick={handleClearClick}
        >
          <svg
            height={16}
            viewBox="0 0 35.9517 35.6001"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.494407 35.1057C1.17995 35.7561 2.2698 35.7561 2.93777 35.1057L17.7737 20.2522L32.6272 35.1057C33.2776 35.7561 34.4026 35.7737 35.053 35.1057C35.721 34.4202 35.721 33.3303 35.053 32.68L20.2171 17.8264L35.053 2.97292C35.721 2.32253 35.7385 1.21511 35.053 0.547141C34.385-0.10325 33.2776-0.10325 32.6272 0.547141L17.7737 15.4007L2.93777 0.547141C2.2698-0.10325 1.16238-0.120828 0.494407 0.547141C-0.155984 1.23269-0.155984 2.32253 0.494407 2.97292L15.3479 17.8264L0.494407 32.68C-0.155984 33.3303-0.173562 34.4378 0.494407 35.1057Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <button
        className="pt-1 pb-2 px-3 text-sm text-[rgb(145,152,161)] hover:text-[rgb(240,246,252)] active:text-[rgb(171,125,248)] cursor-pointer"
        onClick={handleSubtitleClick}
      >
        {subtitle}
      </button>
    </div>
  );
};

export default PlaceHeader;
