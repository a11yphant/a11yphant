import clsx from "clsx";
import React from "react";

const UserAvatar: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg viewBox="0 0 26 26" className={clsx("w-6 h-6", className)} fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <circle cx="13" cy="13" r="12" strokeWidth="2" />
      <circle cx="13" cy="10.833" r="4.333" strokeWidth="2" />
      <path d="M5.436 22.209a7.584 7.584 0 0115.128 0" strokeWidth="2" />
    </svg>
  );
};

export default UserAvatar;
