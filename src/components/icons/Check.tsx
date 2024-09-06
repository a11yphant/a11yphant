import clsx from "clsx";
import React from "react";

const Check: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg fill="none" viewBox="0 0 60 46" className={clsx(className)} aria-hidden="true" {...props}>
      <path d="M4 21.622l17.297 16.756L56 4" stroke="currentColor" strokeWidth="10.16" />
    </svg>
  );
};

export default Check;
