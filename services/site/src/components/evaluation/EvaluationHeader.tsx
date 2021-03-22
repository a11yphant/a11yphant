import React from "react";

interface EvaluationHeaderProps {
  classes?: string;
  challenge: string;
  level: string;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ classes, level, challenge }) => {
  return (
    <div className={`${classes} flex flex-row justify-between items-center box-border pb-6 h-fitContent w-full border-white border-b object-contain`}>
      <h2 className="text-white leading-10">
        <strong>Evaluation</strong> <br /> {challenge} <br /> Level {level}
      </h2>
      <p className="text-8xl text-white font-bold">81%</p>
    </div>
  );
};

export default EvaluationHeader;
