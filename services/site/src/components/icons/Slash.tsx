import clsx from "clsx";
import React from "react";

interface SlashProps {
  className?: string;
}

const Slash: React.FunctionComponent<SlashProps> = ({ className, ...props }) => {
  return (
    <svg
      className={clsx("h-5 w-5 text-gray-300 shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
      {...props}
    >
      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
  );
};

export default Slash;
