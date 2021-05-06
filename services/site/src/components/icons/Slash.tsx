import clsx from "clsx";
import React from "react";

interface SlashProps {
  className?: string;
}

const Slash: React.FunctionComponent<SlashProps> = ({ className }) => {
  return (
    <svg
      className={clsx("text-gray-300 flex-shrink-0 h-5 w-5", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
  );
};

export default Slash;
