import clsx from "clsx";
import React from "react";

const EndOfChallengeFlashMessage: React.FC = () => (
  <p className={clsx("max-w-none p-0 m-0")}>
    <span aria-hidden={true}>🎉 </span>Congratulations! You've reached the end of this challenge!
  </p>
);

export default EndOfChallengeFlashMessage;
