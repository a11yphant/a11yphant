import Check from "app/components/icons/Check";
import X from "app/components/icons/X";
import clsx from "clsx";
import React from "react";

interface EvaluationHeaderProps {
  className?: string;
  challengeName: string;
  levelIdx: number;
  score: number;
  passed: boolean;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ className, levelIdx, challengeName, score, passed }) => {
  return (
    <div className={clsx("flex flex-row justify-between items-center pb-6 h-fit-content w-full border-grey-light border-b", className)}>
      <h2 className="text-grey-middle leading-tight font-normal">
        <strong className="text-light">Evaluation</strong> <br /> {challengeName} <br /> Level{" "}
        {levelIdx.toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h2>
      <div className="flex flex-row justify-between items-center">
        <span className="mr-10">{passed ? <Check className="h-20 w-28 text-success" /> : <X className="h-20 w-20 text-error" />}</span>
        <p className="text-8xl text-white font-mono font-bold">{score.toFixed(0)}%</p>
      </div>
    </div>
  );
};

export default EvaluationHeader;
