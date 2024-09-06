import clsx from "clsx";
import React from "react";

interface ThirdPartyAuthLinkProps {
  href: string;
}

const ThirdPartyAuthLink: React.FC<React.PropsWithChildren<ThirdPartyAuthLinkProps>> = ({ href, children }) => (
  <a
    href={href}
    className={clsx(
      "px-8 py-4 mb-4 block w-full max-w-full text-center align-middle text-light font-normal leading-none rounded border border-light",
      "transition duration-300 group",
      "hover:bg-light hover:text-primary",
    )}
  >
    {children}
  </a>
);

export default ThirdPartyAuthLink;
