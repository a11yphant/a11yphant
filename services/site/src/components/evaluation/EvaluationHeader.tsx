import correctAnimation from "app/lotties/correct_lottie.json";
import failAnimation from "app/lotties/fail_lottie.json";
import clsx from "clsx";
import React from "react";
import Lottie from "react-lottie";

interface EvaluationHeaderProps {
  className?: string;
  challengeName: string;
  levelIdx: number;
  score: number;
  passed: boolean;
}

const EvaluationHeader: React.FunctionComponent<EvaluationHeaderProps> = ({ className, levelIdx, challengeName, score, passed }) => {
  return (
    <div className={clsx("pb-6 h-fit-content w-full flex flex-row justify-between items-center border-grey-light border-b", className)}>
      <h2 className="text-grey-middle leading-tight font-normal">
        <strong className="text-light">Evaluation</strong> <br /> {challengeName} <br /> Level{" "}
        {levelIdx.toLocaleString("de-AT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h2>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h3 className={clsx("ml-2 font-normal", "h2")}>Result</h3>
          {passed ? (
            <Lottie
              options={{
                loop: false,
                autoplay: true,
                animationData: correctAnimation,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={100}
              ariaRole={"img"}
              title={"A cross"}
            />
          ) : (
            <Lottie
              options={{
                loop: false,
                autoplay: true,
                animationData: failAnimation,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={100}
              ariaRole={"img"}
              title={"A cross"}
            />
          )}
        </div>
        <p className={clsx("p-2 pt-1 mt-2 mb-0 text-8xl text-white font-mono font-bold w-fit-content", "container-dark")}>{score.toFixed(0)}%</p>
      </div>
    </div>
  );
};

export default EvaluationHeader;
