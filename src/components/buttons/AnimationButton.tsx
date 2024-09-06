import clsx from "clsx";
import React from "react";

import Button, { ButtonProps } from "./Button";

export interface AnimationButtonProps extends ButtonProps {
  animation: boolean;
  onClick: () => void;
}

const AnimationButton: React.FunctionComponent<React.PropsWithChildren<AnimationButtonProps>> = ({ animation, onClick, ...props }) => {
  return (
    <Button srText="animation" overrideClassName animation className={clsx("mb-52 xs:ml-6 md:ml-0 md:mb-0")} onClick={onClick}>
      {animation ? "Stop" : "Start"}
    </Button>
  );
};

export default AnimationButton;
