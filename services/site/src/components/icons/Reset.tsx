import clsx from "clsx";
import React from "react";

const Reset: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
      aria-hidden="true"
      className={clsx("mr-2 ml-1 h-5 w-5 text-grey", "group transition duration-300", "group-hover:text-primary-light", className)}
      {...props}
    >
      <path
        d="M18 3.634a.545.545 0 01-.541.475h-.073l-1.7-.223A8.77 8.77 0 118.78.51a.548.548 0 010 1.096 7.674 7.674 0 105.957 2.84l-.091 2.119a.548.548 0 01-.545.523h-.025a.541.541 0 01-.523-.57l.146-3.403a.055.055 0 010-.025.279.279 0 010-.055v-.077a.05.05 0 010-.022.556.556 0 01.084-.135.529.529 0 01.19-.142l.073-.026h.216l3.212.428a.548.548 0 01.526.573z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Reset;
