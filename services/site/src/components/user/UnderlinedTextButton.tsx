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
        "mx-3 font-normal text-grey-light border-b-grey-light border-b-2 max-w-max",
        "transition duration-300",
        "hover:border-transparent",
        "focus-visible-outline-offset",
      )}
    >
      {children}
    </Button>
  );
};

export default UnderlinedText;
