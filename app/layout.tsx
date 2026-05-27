import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <html lang="en" className={"subpixel-antialiased"}>
      <body>
        <div className="flex justify-center">
          <div className="w-lvw max-w-[600px]">
            {children}

            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
