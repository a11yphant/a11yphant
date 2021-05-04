import clsx from "clsx";
import React from "react";

interface LegendProps {
  className?: string;
}

const Legend: React.FunctionComponent<LegendProps> = ({ className }) => {
  return (
    <div className={clsx("flex flex-row mt-16 mb-8", className)}>
      <ul className="flex flex-row">
        <li className="text-grey pr-1 mr-2 flex items-center">
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Easy
        </li>
        <li className="text-grey px-1 mx-2 flex items-center">
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-grey mr-1" />
          <div className="w-2.5 h-4/5 border-2 rounded-sm border-grey bg-transparent mr-2" />
          Medium
        </li>
        <li className="text-grey px-1 mx-2 flex items-center">
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
