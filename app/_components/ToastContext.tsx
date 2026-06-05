"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
} from "react";
import {
  goButtonMaxWidthStyle,
  placePageMaxWidthStyle,
} from "../_utils/styling";
import SquircleImage from "./SquircleImage";

type AddToastParam = {
  title: string;
  subtitle: string;
};

const ToastContext = createContext<{
  addToast: (param: AddToastParam) => void;
} | null>(null);

type Toast = {
  id: string;
} & AddToastParam;

type ToastProvideProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProvideProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pathname = usePathname();
  const pageIsFullWidth = ["/"].includes(pathname);

  const backgroundClass = "bg-[#151b23]";

  const borderClasses = "border border-[#3d444d]";

  const transitionDuration = 350;
  const uninterpolatedDurationClass = "duration-350";
  const transitionClasses = [
    `transition-all ${uninterpolatedDurationClass} ease-in-out`,
    `translate-y-[calc(-100%)] opacity-0 invisible`,
    `open:translate-y-0 open:opacity-100 open:visible`,
  ].join(" ");

  const addToast = useCallback(({ title, subtitle }: AddToastParam) => {
    const id = `toast-${Date.now()}`;

    setToasts((previousToasts) => [...previousToasts, { id, title, subtitle }]);

    setTimeout(() => {
      const toast = document.getElementById(id) as HTMLElement;

      toast.setAttribute("open", "");

      setTimeout(() => {
        toast.removeAttribute("open");

        setTimeout(() => {
          setToasts((previousToasts) =>
            previousToasts.filter((toast) => toast.id !== id),
          );
        }, transitionDuration);
      }, 1000);
    }, 20);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.id}
          className={`absolute top-0 z-50 w-dvw ${pageIsFullWidth ? "" : backgroundClass} pt-2 px-2 ${transitionClasses}`}
          style={{
            ...(pageIsFullWidth
              ? goButtonMaxWidthStyle
              : placePageMaxWidthStyle),
          }}
        >
          <div
            className={`${borderClasses} rounded-md ${backgroundClass} px-2 py-2 flex`}
          >
            <SquircleImage
              wrapperClasses={`mr-2 ${borderClasses} bg-[rgb(219,231,203)] h-13 shrink-0`}
              imageClasses={"p-2"}
              imagePath={"/pin.png"}
              imageAltText="wya"
            />

            <div className="grow text-md truncate">
              <div className="font-semibold">{toast.title}</div>

              <div className="truncate">{toast.subtitle}</div>
            </div>
          </div>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext)!;
