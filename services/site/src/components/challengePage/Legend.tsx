import { DifficultyEasy, DifficultyHard, DifficultyMedium } from "app/components/challengePage/difficulties/Difficulties";
import clsx from "clsx";
import React from "react";

interface LegendProps {
  className?: string;
}

const Legend: React.FunctionComponent<LegendProps> = ({ className }) => {
  return (
    <div className={clsx("mt-4 mb-4 flex flex-row", "xs:mt-8 xs:mb-2", "sm:mt-8", className)} aria-hidden="true">
      <ul className={clsx("flex flex-col mb-0", "xs:flex-row")}>
        <li className="pr-1 mr-2 text-grey flex items-center">
          <DifficultyEasy thirdClassName={"mr-2"} />
          Easy
        </li>
        <li className={clsx("text-grey flex items-center", "xs:mx-2 xs:px-1")}>
          <DifficultyMedium thirdClassName={"mr-2"} />
          Medium
        </li>
        <li className={clsx("text-grey flex items-center", "xs:mx-2 xs:px-1")}>
          <DifficultyHard thirdClassName={"mr-2"} />
          Hard <span className="text-xl text-grey">*</span>
        </li>
      </ul>
    </div>
  );
};

export default Legend;
