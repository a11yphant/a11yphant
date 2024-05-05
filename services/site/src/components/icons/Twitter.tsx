import clsx from "clsx";
import React from "react";

const Twitter: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg fill="currentColor" viewBox="0 0 44 44" className={clsx(className)} aria-hidden="true" {...props}>
      <path d="M33.209 16.456c.016.237.016.475.016.715 0 7.312-5.566 15.744-15.743 15.744v-.005A15.664 15.664 0 019 30.43a11.111 11.111 0 008.19-2.293 5.54 5.54 0 01-5.17-3.843c.83.16 1.684.127 2.498-.095a5.534 5.534 0 01-4.439-5.424v-.07c.77.429 1.63.666 2.511.693a5.54 5.54 0 01-1.712-7.389 15.704 15.704 0 0011.404 5.781 5.54 5.54 0 019.43-5.047 11.101 11.101 0 003.513-1.343 5.553 5.553 0 01-2.433 3.06 11.005 11.005 0 003.178-.87 11.242 11.242 0 01-2.761 2.866z" />
    </svg>
  );
};

export default Twitter;
