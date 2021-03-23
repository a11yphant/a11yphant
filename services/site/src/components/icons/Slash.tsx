import React from "react";

interface SlashProps {
  classes?: string;
}

const Slash: React.FunctionComponent<SlashProps> = ({ classes = "text-gray-300" }) => {
  return (
    <svg
      className={`${classes} flex-shrink-0 h-5 w-5`}
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
