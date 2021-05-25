import clsx from "clsx";
import React from "react";

const CheckmarkAnimated: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 -2.5 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={clsx("animated-button", className)}
      {...props}
    >
      <path d="M1 6.5L6.5 12L17 1" stroke="currentColor" stroke-width="1.5" />
    </svg>
  );
};

export default CheckmarkAnimated;
