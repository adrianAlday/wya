export const isStandalone = () =>
  [
    "(display-mode: fullscreen)",
    "(display-mode: minimal-ui)",
    "(display-mode: standalone)",
  ].some((media) => window.matchMedia(media).matches);
