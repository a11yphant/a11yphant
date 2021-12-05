import Lottie from "app/components/Lottie";
import loadingAnimation from "app/lotties/loading_lottie_eval.json";
import clsx from "clsx";
import React from "react";

interface LoadingScreenProps {
  className?: string;
}

const LoadingScreen: React.FunctionComponent<LoadingScreenProps> = ({ className }) => {
  return (
    <div className={clsx(" h-full w-full flex flex-col justify-center items-center box-border", "container-dark", className)}>
      <div>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: loadingAnimation,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          role={"progressbar"}
          className={"h-[300px]"}
        />
      </div>
      <h2 className={clsx("text-5xl")}>Evaluation</h2>
      <br />
      <span className={clsx("text-4xl")}>loading ...</span>
    </div>
  );
};

export default LoadingScreen;
