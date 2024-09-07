import { usePrefersReducedMotion } from "app/hooks/prefersReducedMotion";
import clsx from "clsx";
import React from "react";

const LoadingIndicator: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      viewBox="0 0 15 15"
      className={clsx(!prefersReducedMotion && "animate-spin", "loading-spinner w-[0.94rem] h-[0.94rem]", className)}
      {...props}
    >
      <g>
        <mask id="a" fill="white">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 7.5A7.5 7.5 0 107.5 0" />
        </mask>
        <path
          d="M-1.5 7.5a9 9 0 009 9v-3a6 6 0 01-6-6h-3zm9 9a9 9 0 009-9h-3a6 6 0 01-6 6v3zm9-9a9 9 0 00-9-9v3a6 6 0 016 6h3z"
          fill="currentColor"
          mask="url(#a)"
        />
      </g>
    </svg>
  );
};

export default LoadingIndicator;
