import clsx from "clsx";
import React from "react";

import Button from "../buttons/Button";

interface UnderlinedTextProps {
  onClick?: () => void;
  className?: string;
}

const UnderlinedText: React.FC<React.PropsWithChildren<UnderlinedTextProps>> = ({ children, onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      overrideClassName
      className={clsx(
        "mx-3 font-normal text-grey-light border-b-grey-light border-b-2 max-w-max",
        "transition duration-300",
        "hover:border-transparent",
        "focus-rounded-instead-of-underline",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default UnderlinedText;
