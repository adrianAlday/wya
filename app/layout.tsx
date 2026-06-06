import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "./_components/ToastContext";
import LoadingWrapper from "./_components/LoadingWrapper";
import AboutPageLogger from "./_components/AboutPageLogger";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <html lang="en" className={"subpixel-antialiased"}>
    <body>
      <div className="flex justify-center">
        <ToastProvider>
          <LoadingWrapper>{children}</LoadingWrapper>
        </ToastProvider>
      </div>

      <AboutPageLogger />

      <Analytics />
    </body>
  </html>
);

export default Layout;
