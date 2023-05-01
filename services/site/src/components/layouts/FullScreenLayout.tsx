import clsx from "clsx";
import React from "react";

interface FullScreenLayoutProps {
  header: JSX.Element;
  footer?: JSX.Element;
}

const FullScreenLayout: React.FC<React.PropsWithChildren<FullScreenLayoutProps>> = ({ children, header, footer }) => (
  <div className={clsx("h-screen max-h-screen flex flex-col")}>
    <div className={clsx("shrink-0")}>{header}</div>
    <div className={clsx("flex-auto overflow-hidden")}>{children}</div>
    <div className={clsx("shrink-0")}>{footer}</div>
  </div>
);

export default FullScreenLayout;
