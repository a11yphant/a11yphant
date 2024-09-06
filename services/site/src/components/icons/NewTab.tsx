import clsx from "clsx";
import React from "react";

const NewTab: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg viewBox="0 0 516 516" fill="none" className={clsx("inline-block ml-1 mb-1 w-4 h-4", className)} aria-hidden="true" {...props}>
      <path d="M215 300L384 131" stroke="currentColor" stroke-width="41" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M410 277V405C410 454.706 369.706 495 320 495H111C61.2944 495 21 454.706 21 405V195C21 145.294 61.2967 105 111.002 105C152.141 105 183.713 105 234 105"
        stroke="currentColor"
        stroke-width="41"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M458.999 65.3678C459.009 62.9579 458.053 60.6443 456.344 58.9451C454.635 57.2459 452.316 56.303 449.907 56.3277L317.908 57.6775C314.28 57.7146 311.029 59.9264 309.663 63.2874C308.296 66.6483 309.081 70.5011 311.654 73.0592L443.058 203.714C445.631 206.272 449.488 207.035 452.841 205.649C456.194 204.264 458.388 201 458.404 197.372L458.999 65.3678Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="18"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default NewTab;
