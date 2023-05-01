import clsx from "clsx";
import React from "react";

const ChallengeCompletedFlashMessage: React.FC = () => (
  <p className={clsx("max-w-none p-0 m-0")}>
    <span aria-hidden={true}>🎉 </span>Congratulations! You have completed this challenge!
  </p>
);

export default ChallengeCompletedFlashMessage;
