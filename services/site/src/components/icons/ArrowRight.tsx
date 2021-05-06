import clsx from "clsx";
import React from "react";

const ArrowRight: React.FunctionComponent = () => {
  return (
    <svg viewBox="0 0 44 44" fill="currentColor" className={clsx("text-white h-7 w-7 pl-2")} aria-hidden="true" focusable="false">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 20.332h16.264L19.8 12.866 21.665 11 32.33 21.665 21.665 32.33l-1.866-1.866 7.465-7.466H11v-2.666z"
      />
    </svg>
  );
};

export default ArrowRight;
