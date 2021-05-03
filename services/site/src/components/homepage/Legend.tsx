import React from "react";

interface LegendProps {
  className?: string;
}

const Legend: React.FunctionComponent<LegendProps> = ({ className }) => {
  return (
    <div className={`${className} flex flex-row mt-16 mb-5`}>
      <ul className="flex flex-row">
        <li className="text-primary pr-1 mr-2 flex items-center">
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-white mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-white mr-2" />
          Easy
        </li>
        <li className="text-primary px-1 mx-2 flex items-center">
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-white mr-2" />
          Medium
        </li>
        <li className="text-primary px-1 mx-2 flex items-center">
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-1" />
          <div className="w-3 h-4/5 border-2 rounded border-primary bg-primary mr-2" />
          Hard
        </li>
      </ul>
    </div>
  );
};

export default Legend;
