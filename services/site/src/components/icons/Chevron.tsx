import clsx from "clsx";
import React from "react";

const Chevron: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      className={clsx("h-8 w-8 group", "transition duration-300", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M11 28l11-11 11 11" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default Chevron;
