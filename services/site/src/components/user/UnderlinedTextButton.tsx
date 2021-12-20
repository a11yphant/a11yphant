import clsx from "clsx";
import React from "react";

import Button from "../buttons/Button";

interface UnderlinedTextProps {
  onClick?: () => void;
}

const UnderlinedText: React.FC<UnderlinedTextProps> = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
      overrideClassName
      className={clsx(
        "py-1 px-1 mx-3 font-normal text-grey-light border-b-grey-light border-b-2 max-w-max",
        "transition duration-300",
        "hover:border-transparent",
        "focus-visible:outline-none focus-visible:bg-light focus-visible:text-primary",
      )}
    >
      {children}
    </Button>
  );
};

export default UnderlinedText;
