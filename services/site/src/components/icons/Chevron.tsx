import React from "react";

const Chevron: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="currentColor"
      className={`${className} h-8 w-8 transition duration-300 group`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M11 28l11-11 11 11" stroke="#B4B8B8" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default Chevron;
