"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
} from "react";
import { pageMaxWidthClass } from "../_utils/styling";
import Image from "next/image";

type AddToastParam = {
  title: string;
  subtitle: string;
  type?: "success" | "error";
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

  const transitionDuration = 350;
  const uninterpolatedDurationClass = "duration-350";

  const addToast = useCallback(({ title, subtitle, type }: AddToastParam) => {
    const id = `toast-${Date.now()}`;

    setToasts((previousToasts) => [
      ...previousToasts,
      { id, title, subtitle, type: type || "success" },
    ]);

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
    }, 1);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.id}
          className={`absolute top-0 z-50 w-dvw ${pageIsFullWidth ? "" : pageMaxWidthClass} bg-[#151b23] pt-2 px-2 translate-y-[calc(-100%)] opacity-0 invisible transition-all ${uninterpolatedDurationClass} ease-out open:translate-y-0 open:opacity-100 open:visible`}
        >
          <div className="border border-[#3d444d] rounded-md px-2 py-2 flex">
            <div
              className={
                "mr-2 border border-[#3d444d] rounded-[22.5%] h-13 shrink-0 aspect-square relative"
              }
            >
              <Image
                src={"/pin.png"}
                alt={"wya"}
                fill
                className={"rounded-[22.5%] p-2 bg-[rgb(219,231,203)]"}
              />
            </div>

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
