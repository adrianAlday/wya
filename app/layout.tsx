import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "./_components/ToastContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <html lang="en" className={"subpixel-antialiased"}>
    <body>
      <div className="flex justify-center">
        <ToastProvider>{children}</ToastProvider>
      </div>

      <Analytics />
    </body>
  </html>
);

export default Layout;
