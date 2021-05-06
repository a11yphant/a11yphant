import clsx from "clsx";
import React from "react";

const X: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg viewBox="0 0 44 44" fill="currentColor" className={clsx("h-6 w-6", className)} aria-hidden="true" focusable="false" {...props}>
      <path d="M13 14.895L14.895 13 31 29.105 29.105 31z" />
      <path d="M29.105 13L31 14.895 14.895 31 13 29.105z" />
    </svg>
  );
};

export default X;
