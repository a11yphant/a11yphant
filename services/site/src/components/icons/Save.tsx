import clsx from "clsx";
import React from "react";

const Save: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={clsx("w-6 h-6", className)} aria-hidden="true" focusable="false">
      <path d="M15 16a3 3 0 11-6 0 3 3 0 016 0z" stroke="#EDEDED" strokeWidth="2" strokeMiterlimit="10" />
      <path d="M22 23H2a1 1 0 01-1-1V2a1 1 0 011-1h16.172a1 1 0 01.707.293l3.828 3.828a1 1 0 01.293.707V22a1 1 0 01-1 1z" strokeWidth="2" />
      <path strokeWidth="2" d="M7 1h10v7H7z" />
    </svg>
  );
};

export default Save;
