import clsx from "clsx";
import React from "react";

const Check: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 60 46"
      className={clsx("h-6 w-6", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M4 21.622l17.297 16.756L56 4" stroke="currentColor" strokeWidth="10.16" />
    </svg>
  );
};

export default Check;
