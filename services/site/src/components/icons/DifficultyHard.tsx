import clsx from "clsx";
import React from "react";

const DifficultyMedium: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 25 15"
      fill="currentColor"
      stroke="currentColor"
      className={clsx("text-primary", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="7" height="15" rx="2" fill="#EDEDED" />
      <rect x="9" width="7" height="15" rx="2" fill="#EDEDED" />
      <rect x="18" width="7" height="15" rx="2" fill="#EDEDED" />
    </svg>
  );
};

export default DifficultyMedium;
