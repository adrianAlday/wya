import "./globals.css";
import type { Metadata } from "next";

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
          <div className="w-80">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
