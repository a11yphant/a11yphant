import React from "react";

interface FullScreenLayoutProps {
  header: JSX.Element;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children, header }) => (
  <div className="h-screen max-h-screen flex flex-col">
    <div className="flex-shrink-0">{header}</div>
    <div className="flex-auto overflow-hidden">{children}</div>
  </div>
);

export default FullScreenLayout;
