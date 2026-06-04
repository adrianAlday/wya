import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "./_components/ToastContext";
import LoadingWrapper from "./_components/LoadingWrapper";

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

      <Analytics />
    </body>
  </html>
);

export default Layout;
