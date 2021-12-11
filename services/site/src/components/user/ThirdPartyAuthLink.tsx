import clsx from "clsx";
import React from "react";

interface ThirdPartyAuthLinkProps {
  href: string;
}

const ThirdPartyAuthLink: React.FC<ThirdPartyAuthLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className={clsx(
      "px-8 py-4 mb-2 block w-full text-center align-middle text-light font-normal leading-none rounded border border-white",
      "transition duration-300 group",
      "hover:bg-white hover:text-primary",
    )}
  >
    {children}
  </a>
);

export default ThirdPartyAuthLink;
