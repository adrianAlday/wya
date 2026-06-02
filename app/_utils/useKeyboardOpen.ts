import { useState, useEffect } from "react";

export const useKeyboardOpen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [hasKeyboardOpened, sethasKeyboardOpened] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const { visualViewport } = window;

    const handleResize = () => {
      if (window.innerHeight - visualViewport.height > 60) {
        setIsKeyboardOpen(true);
        sethasKeyboardOpened(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    visualViewport.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isKeyboardOpen, hasKeyboardOpened };
};
