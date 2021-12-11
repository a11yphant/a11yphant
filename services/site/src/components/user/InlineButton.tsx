import clsx from "clsx";
import React from "react";

import Button from "../buttons/Button";

interface InlineButtonProps {
  onClick?: () => void;
}

const InlineButton: React.FC<InlineButtonProps> = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
      overrideClassName
      className={clsx(
        "my-1 mx-3 font-normal text-grey-light border-b-grey-light border-b-2 max-w-max",
        "transition duration-300",
        "hover:border-transparent",
        "focus:border-transparent",
      )}
    >
      {children}
    </Button>
  );
};

export default InlineButton;
