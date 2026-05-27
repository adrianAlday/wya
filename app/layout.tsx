import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <html lang="en" className={"subpixel-antialiased"}>
    <body>
      <div className="flex justify-center">
        {children}

        <Analytics />
      </div>
    </body>
  </html>
);

export default Layout;
