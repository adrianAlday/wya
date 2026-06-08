import { Suspense } from "react";

type LoadingWrapperProps = {
  children: React.ReactNode;
};

const LoadingWrapper = ({ children }: LoadingWrapperProps) => (
  <Suspense fallback={<div />}>{children}</Suspense>
);

export default LoadingWrapper;
