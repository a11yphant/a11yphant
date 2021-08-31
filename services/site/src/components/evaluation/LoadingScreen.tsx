import loadingAnimation from "app/lotties/loading_lottie_eval.json";
import clsx from "clsx";
import React from "react";
import Lottie from "react-lottie";

interface LoadingScreenProps {
  className?: string;
}

const LoadingScreen: React.FunctionComponent<LoadingScreenProps> = ({ className }) => {
  return (
    <div className={clsx("flex flex-col justify-center items-center box-border h-full w-full", "container-dark", className)}>
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
          height={300}
          ariaRole={"progressbar"}
        />
      </div>
      <h2 className="text-5xl">Evaluation</h2>
      <br />
      <span className="text-4xl">loading ...</span>
    </div>
  );
};

export default LoadingScreen;
