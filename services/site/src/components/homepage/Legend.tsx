import clsx from "clsx";
import React from "react";

interface LegendProps {
  className?: string;
}

const Legend: React.FunctionComponent<LegendProps> = ({ className }) => {
  return (
    <div className={clsx("mt-4 mb-4 flex flex-row", "xs:mt-8 xs:mb-8", "sm:mt-16", className)} aria-hidden="true">
      <ul className={clsx("flex flex-col", "xs:flex-row")}>
        <li className="pr-1 mr-2 text-grey flex items-center">
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Easy
        </li>
        <li className={clsx("text-grey flex items-center", "xs:mx-2 xs:px-1")}>
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Medium
        </li>
        <li className={clsx("text-grey flex items-center", "xs:mx-2 xs:px-1")}>
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-2" />
          Hard
        </li>
      </ul>
    </div>
  );
};

export default Legend;
