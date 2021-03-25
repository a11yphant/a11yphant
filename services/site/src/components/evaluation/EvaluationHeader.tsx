import React from "react";

interface EvaluationHeaderProps {
  className?: string;
  challengeName: string;
  levelIdx: string;
  score: number;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ className, levelIdx, challengeName, score }) => {
  return (
    <div className={`${className} flex flex-row justify-between items-center box-border pb-6 h-fitContent w-full border-white border-b`}>
      <h2 className="text-white leading-10">
        <strong>Evaluation</strong> <br /> {challengeName} <br /> Level {levelIdx}
      </h2>
      <p className="text-8xl text-white font-bold">{score && `${score.toFixed(0)}%`}</p>
    </div>
  );
};

export default EvaluationHeader;
