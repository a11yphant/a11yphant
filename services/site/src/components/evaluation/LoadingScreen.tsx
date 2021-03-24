import React from "react";

interface LoadingScreenProps {
  className?: string;
}

const LoadingScreen: React.FunctionComponent<LoadingScreenProps> = ({ className }) => {
  return (
    <div className={`${className} flex flex-row justify-center items-center box-border h-full w-full`}>
      <h3 className="text-white leading-10 h2 text-center">
        <strong>Evaluation</strong> <br /> loading...
      </h3>
    </div>
  );
};

export default LoadingScreen;
