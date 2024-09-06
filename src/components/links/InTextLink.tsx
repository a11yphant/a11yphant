import clsx from "clsx";
import React from "react";

export interface InTextLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  overrideClassName?: boolean;
  opensInNewTab?: boolean;
}

const InTextLink: React.FunctionComponent<InTextLinkProps> = ({ overrideClassName = false, className, children, opensInNewTab, ...props }) => {
  return (
    <a
      className={clsx(
        className,
        !overrideClassName &&
          `text-light font-sans font-normal border-light
        transition-colors duration-300
        hover:text-primary-light hover:border-transparent
        focus-rounded-instead-of-underline`,
      )}
      target={opensInNewTab ? "_blank" : undefined}
      rel={opensInNewTab ? "noopener noreferrer nofollow" : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default InTextLink;
