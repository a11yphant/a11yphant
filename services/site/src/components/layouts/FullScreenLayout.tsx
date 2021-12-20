import clsx from "clsx";
import React from "react";

interface FullScreenLayoutProps {
  header: JSX.Element;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children, header }) => (
  <div className={clsx("h-screen max-h-screen flex flex-col")}>
    <div className={clsx("shrink-0")}>{header}</div>
    <div className={clsx("flex-auto overflow-hidden")}>{children}</div>
  </div>
);

export default FullScreenLayout;
