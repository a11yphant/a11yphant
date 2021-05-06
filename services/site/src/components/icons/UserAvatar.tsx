import clsx from "clsx";
import React from "react";

const UserAvatar: React.FunctionComponent = () => {
  return (
    <svg className={clsx("h-full w-full text-gray-300")} fill="none" stroke="currentColor" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <circle cx="22" cy="22" r="12" stroke-width="2" />
      <circle cx="22" cy="19.833" r="4.333" stroke-width="2" />
      <path d="M14.436 31.208a7.584 7.584 0 0115.128 0" stroke-width="2" />
    </svg>
  );
};

export default UserAvatar;
