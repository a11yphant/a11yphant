import clsx from "clsx";
import React from "react";

interface LegendProps {
  className?: string;
}

const Legend: React.FunctionComponent<LegendProps> = ({ className }) => {
  return (
    <div className={clsx("mt-16 mb-8 flex flex-row", className)} aria-hidden="true">
      <ul className="flex flex-row">
        <li className="pr-1 mr-2 text-grey flex items-center">
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Easy
        </li>
        <li className="px-1 mx-2 text-grey flex items-center">
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Medium
        </li>
        <li className="px-1 mx-2 text-grey flex items-center">
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
