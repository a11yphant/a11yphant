import React from "react";

const ChevronLeft: React.FunctionComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-8 w-8 text-primary transition duration-700 group group-hover:text-white group-focus:text-white"
      aria-hidden="true"
      focusable="false"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
};

export default ChevronLeft;
