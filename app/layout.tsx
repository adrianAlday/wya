import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "wya",
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <html lang="en" className={"subpixel-antialiased"}>
      <body>
        <div className="flex justify-center">
          <div className="w-80">
            <Link href={"/"}>
              <div className="text-sm font-semibold my-4">📍 wya</div>
            </Link>

            {children}

            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
