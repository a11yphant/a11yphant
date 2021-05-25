import clsx from "clsx";
import React from "react";

interface EvaluationHeaderProps {
  className?: string;
  challengeName: string;
  levelIdx: string;
  score: number;
  showScore: boolean;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ className, levelIdx, challengeName, score, showScore }) => {
  return (
    <div className={clsx("flex flex-row justify-between items-center pb-6 h-fitContent w-full border-greyLight border-b", className)}>
      <h2 className="text-greyMiddle leading-tight font-normal">
        <strong className="text-light">Evaluation</strong> <br /> {challengeName} <br /> Level {levelIdx}
      </h2>
      <p className="text-8xl text-white font-ibmPlexMono font-bold">{showScore && `${score.toFixed(0)}%`}</p>
    </div>
  );
};

export default EvaluationHeader;
