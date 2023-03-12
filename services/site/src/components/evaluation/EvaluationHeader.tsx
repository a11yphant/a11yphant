import clsx from "clsx";
import React from "react";

interface EvaluationHeaderProps {
  className?: string;
  challengeName: string;
  levelIdx: number;
  score: number;
  passed: boolean;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ className, challengeName, levelIdx, score, passed }) => {
  return (
    <div className={clsx("pb-6 h-fit-content w-full flex flex-row justify-between items-center border-grey-light border-b", className)}>
      <h2 className={clsx("text-grey-middle leading-tight font-normal", "h3", "lg:h2 lg:text-grey-middle lg:leading-tight lg:font-normal")}>
        <strong className={clsx("text-light")}>Evaluation</strong> <br /> {challengeName} <br /> Level{" "}
        {levelIdx.toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h2>
      <div className={clsx("flex flex-col items-end")}>
        <h3 className={clsx("ml-2 font-normal", "h3", "lg:h2")}>Result</h3>
        <p
          className={clsx(
            "p-2 pt-1 mt-2 mb-0 text-7xl text-light font-mono font-bold w-fit-content",
            "container-dark",
            "lg:text-8xl",
            passed ? "text-success" : "text-light",
          )}
          aria-label={`You reached a score of ${score.toFixed(0)} percent`}
        >
          {score.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default EvaluationHeader;
