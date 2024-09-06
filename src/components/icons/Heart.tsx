import clsx from "clsx";
import React from "react";

const Heart: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg fill="none" className={clsx(className)} aria-hidden="true" {...props} viewBox="0 0 22 22">
      <path
        fill="currentColor"
        d="M12.001 4.529a5.998 5.998 0 0 1 8.242.228a6 6 0 0 1 .236 8.236l-8.48 8.492l-8.478-8.492a6 6 0 0 1 8.48-8.464Zm6.826 1.641a3.998 3.998 0 0 0-5.49-.153l-1.335 1.198l-1.336-1.197a4 4 0 0 0-5.686 5.605L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454Z"
      />
    </svg>
  );
};

export default Heart;
