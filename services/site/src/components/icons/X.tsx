import clsx from "clsx";
import React from "react";

const X: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg viewBox="0 0 45 45" fill="none" className={clsx("h-4 w-4", className)} aria-hidden="true" focusable="false" {...props}>
      <path d="M41 4L4 41M4 4l37 37" stroke="currentColor" strokeWidth="11.031" />
    </svg>
  );
};

export default X;
